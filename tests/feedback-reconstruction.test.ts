import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FEEDBACK_BACKEND_BUCKETS,
  FEEDBACK_FRAME_RATE_BUCKETS,
  FEEDBACK_FRAME_TIME_BUCKETS,
  FEEDBACK_GAME_COUNTER_CODES,
  FEEDBACK_GAME_ERROR_CODES,
  FEEDBACK_GAME_FEATURE_IDS,
  FEEDBACK_RENDERER_BUCKETS,
  FEEDBACK_VIEWPORT_BUCKETS,
  FeedbackGameReconstructionManifestSchema,
} from "@plasius/schema";
import {
  buildMcpContextResponse,
  buildMcpDiscoveryResponse,
  buildMcpSchemaResponse,
  mcpAdminContractDescriptionKeys,
  mcpAdminContractsEnGbTranslations,
  MCP_ADMIN_CONTRACT_VERSION,
  MCP_ADMIN_FEEDBACK_ACTIONS,
  MCP_ADMIN_FEEDBACK_FLAG_ID,
  MCP_ADMIN_FEEDBACK_HOST_DEFAULT_ENABLED,
  MCP_ADMIN_FEEDBACK_PRIVACY_EXCLUSIONS,
  MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
  MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
  MCP_ADMIN_FEEDBACK_SCHEMA_CONTRACT_VERSION,
  MCP_ADMIN_FEEDBACK_SCHEMA_PACKAGE,
  MCP_ADMIN_FOUNDATION_ENV_VAR,
  MCP_ADMIN_FOUNDATION_FLAG_ID,
} from "../src/index.js";
import type { McpFieldShape } from "../src/index.js";

const UUID_V4_PATTERN =
  "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";

const objectProperties = (
  field: McpFieldShape,
): Record<string, McpFieldShape> => {
  expect(field.type).toBe("object");
  expect(field.additionalProperties).toBe(false);
  expect(field.properties).toBeDefined();
  return field.properties!;
};

const unionVariant = (
  field: McpFieldShape,
  discriminatorValue: string,
): McpFieldShape => {
  expect(field.type).toBe("discriminated-union");
  const variant = field.oneOf?.find(
    (candidate) =>
      candidate.properties?.[field.discriminator!]?.constValue ===
      discriminatorValue,
  );
  expect(variant).toBeDefined();
  return variant!;
};

const collectFieldKeys = (
  fields: Record<string, McpFieldShape>,
): string[] =>
  Object.entries(fields).flatMap(([key, field]) => [
    key,
    ...(field.properties ? collectFieldKeys(field.properties) : []),
    ...(field.items?.properties
      ? collectFieldKeys(field.items.properties)
      : []),
    ...(field.items?.oneOf ?? []).flatMap((variant) =>
      variant.properties ? collectFieldKeys(variant.properties) : [],
    ),
    ...(field.oneOf ?? []).flatMap((variant) =>
      variant.properties ? collectFieldKeys(variant.properties) : [],
    ),
  ]);

describe("privacy-safe feedback game reconstruction contract", () => {
  it("publishes one exact, read-only and fail-closed reconstruction point read", () => {
    expect(MCP_ADMIN_CONTRACT_VERSION).toBe("2026-08-26.v8");
    expect(MCP_ADMIN_FEEDBACK_HOST_DEFAULT_ENABLED).toBe(false);

    const action = MCP_ADMIN_FEEDBACK_ACTIONS.find(
      (candidate) => candidate.name === "getFeedbackGameReconstruction",
    );
    expect(action).toBeDefined();
    expect(action).toMatchObject({
      domain: "feedback",
      rolloutFlag: MCP_ADMIN_FEEDBACK_FLAG_ID,
      requiredCapability: MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
      oauthScopes: MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
      availability: "near-future",
      execution: {
        method: "GET",
        path: "/api/admin/feedback/reconstructions/{bugPacketId}",
        source: "near-future-route",
      },
      access: {
        oauthScopes: MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
        capabilities: [MCP_ADMIN_FEEDBACK_READ_CAPABILITY],
        rolloutFlags: [MCP_ADMIN_FEEDBACK_FLAG_ID],
        mode: "read-only",
        identityResolution: "not-available",
      },
      schemaSource: {
        packageName: MCP_ADMIN_FEEDBACK_SCHEMA_PACKAGE,
        contractVersion: MCP_ADMIN_FEEDBACK_SCHEMA_CONTRACT_VERSION,
        schemaNames: ["FeedbackGameReconstructionManifestSchema"],
      },
    });
    expect(action?.input).toEqual({
      bugPacketId: expect.objectContaining({
        type: "string",
        required: true,
        format: "uuid",
        minLength: 36,
        maxLength: 36,
        pattern: UUID_V4_PATTERN,
      }),
    });
    expect(action?.input).not.toHaveProperty("cursor");
    expect(action?.input).not.toHaveProperty("query");
    expect(action?.input).not.toHaveProperty("from");
    expect(action?.input).not.toHaveProperty("to");
    expect(action?.input).not.toHaveProperty("url");
    expect(action?.output).toEqual({
      item: expect.objectContaining({
        type: "object",
        additionalProperties: false,
      }),
    });
    expect(action?.execution.notes?.join(" ")).toMatch(
      /not a literal screenshot/i,
    );
    expect(action?.execution.notes?.join(" ")).toMatch(
      /uniform not-found/i,
    );
  });

  it("matches the closed canonical reconstruction manifest and diagnostics", () => {
    const action =
      buildMcpSchemaResponse().actions.getFeedbackGameReconstruction!;
    const manifest = objectProperties(action.output.item!);
    const canonical = FeedbackGameReconstructionManifestSchema as unknown as {
      meta: { entityType: string; version: string };
      _shape: Record<string, { isRequired: boolean }>;
    };

    expect(Object.keys(manifest).sort()).toEqual(
      Object.keys(canonical._shape).sort(),
    );
    expect(
      Object.entries(manifest)
        .filter(([, field]) => field.required !== false)
        .map(([key]) => key)
        .sort(),
    ).toEqual(
      Object.entries(canonical._shape)
        .filter(([, field]) => field.isRequired)
        .map(([key]) => key)
        .sort(),
    );
    expect(manifest.type?.constValue).toBe(canonical.meta.entityType);
    expect(manifest.version?.constValue).toBe(canonical.meta.version);
    expect(manifest.reconstructionId?.pattern).toBe(UUID_V4_PATTERN);
    expect(manifest.bugPacketId?.pattern).toBe(UUID_V4_PATTERN);
    expect(manifest.curatedAssetSetId).toMatchObject({
      minLength: 1,
      maxLength: 128,
      pattern: "^[A-Za-z0-9][A-Za-z0-9._:-]*$",
    });
    expect(manifest.noticeKey).toMatchObject({
      minLength: 1,
      maxLength: 160,
      pattern: "^[A-Za-z0-9][A-Za-z0-9._:-]*$",
    });

    const diagnostics = manifest.diagnostics!;
    expect(diagnostics.required).not.toBe(false);
    expect(diagnostics.discriminator).toBe("surfaceId");
    expect(diagnostics.oneOf).toHaveLength(2);

    const generator = objectProperties(
      unionVariant(diagnostics, "site.generator"),
    );
    expect(generator.renderer?.enum).toEqual(FEEDBACK_RENDERER_BUCKETS);
    expect(generator.backend?.enum).toEqual(FEEDBACK_BACKEND_BUCKETS);
    expect(generator.viewportBucket?.enum).toEqual(FEEDBACK_VIEWPORT_BUCKETS);
    expect(generator.frameRateBucket?.enum).toEqual(
      FEEDBACK_FRAME_RATE_BUCKETS,
    );
    expect(generator.frameTimeBucket?.enum).toEqual(
      FEEDBACK_FRAME_TIME_BUCKETS,
    );
    expect(generator.featureIds?.items?.enum).toEqual(
      FEEDBACK_GAME_FEATURE_IDS,
    );
    expect(generator.counters?.items?.properties?.code?.enum).toEqual(
      FEEDBACK_GAME_COUNTER_CODES,
    );
    expect(generator.errorCodes?.items?.enum).toEqual(
      FEEDBACK_GAME_ERROR_CODES,
    );

    const validManifest = {
      type: canonical.meta.entityType,
      version: canonical.meta.version,
      reconstructionId: "11111111-1111-4111-8111-111111111111",
      bugPacketId: "22222222-2222-4222-8222-222222222222",
      createdAt: "2026-08-26T10:00:00.000Z",
      expiresAt: "2026-09-18T10:00:00.000Z",
      curatedAssetSetId: "generator.public-assets.v1",
      noticeKey: "feedback.reconstruction.not-a-screenshot",
      diagnostics: {
        type: "feedback-game-diagnostics",
        version: canonical.meta.version,
        surfaceId: "site.generator",
        consentConfirmed: true,
        provenanceContractId: "generator.renderer-diagnostics.v1",
        renderer: FEEDBACK_RENDERER_BUCKETS[0],
        backend: FEEDBACK_BACKEND_BUCKETS[0],
        viewportBucket: FEEDBACK_VIEWPORT_BUCKETS[0],
        frameRateBucket: FEEDBACK_FRAME_RATE_BUCKETS[0],
        frameTimeBucket: FEEDBACK_FRAME_TIME_BUCKETS[0],
        featureIds: [],
        counters: [],
        errorCodes: [],
      },
    };
    expect(
      FeedbackGameReconstructionManifestSchema.validate(validManifest).valid,
    ).toBe(true);
    expect(
      FeedbackGameReconstructionManifestSchema.validate({
        ...validManifest,
        screenshot: "synthetic-forbidden-pixel-data",
      }).valid,
    ).toBe(false);
  });

  it("excludes sensitive content, request telemetry and storage locators", () => {
    const action =
      buildMcpSchemaResponse().actions.getFeedbackGameReconstruction!;
    const forbiddenKeys = [
      "accountId",
      "userId",
      "reporterId",
      "pseudonym",
      "narrative",
      "text",
      "summary",
      "quote",
      "pixels",
      "binaryImage",
      "screenshot",
      "blobReference",
      "blobUri",
      "storageUrl",
      "url",
      "requestIp",
      "requestHeaders",
      "requestUrl",
      "requestTelemetry",
      "userAgent",
      "sessionId",
      "referrer",
      "clientTimestamp",
      "filename",
      "coordinates",
      "adapterFingerprint",
      "rawWarning",
    ];
    const outputKeys = collectFieldKeys(action.output);

    for (const forbiddenKey of forbiddenKeys) {
      expect(outputKeys).not.toContain(forbiddenKey);
    }
    expect(MCP_ADMIN_FEEDBACK_PRIVACY_EXCLUSIONS).toEqual(
      expect.arrayContaining([
        "reporter-pseudonyms",
        "narrative",
        "binary-images",
        "client-pixels",
        "blob-references",
        "request-telemetry",
        "unrestricted-scans",
        "mutations",
      ]),
    );
  });

  it("propagates reconstruction discovery, translation and family metadata", () => {
    const action = buildMcpDiscoveryResponse().actions.find(
      (candidate) => candidate.name === "getFeedbackGameReconstruction",
    );
    expect(action?.descriptionKey).toBe(
      mcpAdminContractDescriptionKeys.actionGetFeedbackGameReconstruction,
    );
    expect(action?.descriptionDefault).toBe(
      mcpAdminContractsEnGbTranslations[
        mcpAdminContractDescriptionKeys.actionGetFeedbackGameReconstruction
      ],
    );

    const context = buildMcpContextResponse({
      origin: "https://plasius.co.uk",
      rollout: {
        foundationFlagId: MCP_ADMIN_FOUNDATION_FLAG_ID,
        foundationEnabled: false,
        foundationSource: "feature-flag",
        envOverride: MCP_ADMIN_FOUNDATION_ENV_VAR,
      },
    });
    const feedbackFamily = context.actionFamilies.find(
      (family) => family.domain === "feedback",
    );
    expect(feedbackFamily).toMatchObject({
      rolloutFlag: MCP_ADMIN_FEEDBACK_FLAG_ID,
      requiredCapability: MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
      oauthScopes: MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
    });
    expect(feedbackFamily?.actions).toContain(
      "getFeedbackGameReconstruction",
    );
  });

  it("documents the default-off host boundary and zero-pixel response", () => {
    const read = (relativePath: string): string =>
      readFileSync(new URL(relativePath, import.meta.url), "utf8");
    const readme = read("../README.md");
    const flags = read("../FLAGS_AND_CAPABILITIES.md");
    const changelog = read("../CHANGELOG.md");
    const adr = read(
      "../docs/adrs/adr-0007-safe-game-reconstruction-point-read.md",
    );

    for (const document of [readme, adr]) {
      expect(document).toContain("getFeedbackGameReconstruction");
      expect(document).toMatch(/not a literal\s+screenshot/i);
      expect(document).toMatch(/request telemetry/i);
      expect(document).toMatch(/Blob reference/i);
      expect(document).toMatch(/no\s+list,[\s\S]{0,100}mutation/i);
    }
    expect(flags).toMatch(/disabled\s+by default/i);
    expect(flags).toContain(MCP_ADMIN_FEEDBACK_FLAG_ID);
    expect(changelog).toContain("2026-08-26.v8");
    expect(changelog).toContain("getFeedbackGameReconstruction");
  });
});
