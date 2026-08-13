import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createI18n } from "@plasius/translations";
import {
  FEEDBACK_BACKEND_BUCKETS,
  FEEDBACK_CONTRACT_VERSION,
  FEEDBACK_FRAME_RATE_BUCKETS,
  FEEDBACK_FRAME_TIME_BUCKETS,
  FEEDBACK_GAME_COUNTER_CODES,
  FEEDBACK_GAME_ERROR_CODES,
  FEEDBACK_GAME_FEATURE_IDS,
  FEEDBACK_INTENT_IDS,
  FEEDBACK_PERSISTABLE_ISSUE_TYPES,
  FEEDBACK_RENDERER_BUCKETS,
  FEEDBACK_SENTIMENT_BUCKETS,
  FEEDBACK_SURFACE_IDS,
  FEEDBACK_THEME_IDS,
  FEEDBACK_VIEWPORT_BUCKETS,
  FeedbackBugPacketSchema,
  FeedbackDailySatisfactionReportSchema,
  FeedbackHourlyBugReportSchema,
  FeedbackProcessorCheckpointSchema,
  FeedbackReviewPacketSchema,
} from "@plasius/schema";
import type { McpFieldShape } from "../src/index.js";
import {
  buildAiPluginManifest,
  buildMcpContextResponse,
  buildMcpDiscoveryResponse,
  buildMcpSchemaResponse,
  getMcpAdminContractDefaultTranslation,
  mcpAdminContractDescriptionKeys,
  mcpAdminContractsEnGbTranslations,
  mcpAdminContractsTranslations,
  MCP_ADMIN_ACTIONS,
  MCP_ADMIN_ANALYTICS_DIMENSIONS,
  MCP_ADMIN_ANALYTICS_METRICS,
  MCP_ADMIN_ANALYTICS_PRESETS,
  MCP_ADMIN_BASE_OAUTH_SCOPE,
  MCP_ADMIN_CONTRACT_VERSION,
  MCP_ADMIN_FEEDBACK_ACTIONS,
  MCP_ADMIN_FEEDBACK_ALERT_WINDOWS,
  MCP_ADMIN_FEEDBACK_BUG_HEALTH_WINDOWS,
  MCP_ADMIN_FEEDBACK_ENTRY_WINDOWS,
  MCP_ADMIN_FEEDBACK_FLAG_ID,
  MCP_ADMIN_FEEDBACK_MAX_CURSOR_LENGTH,
  MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE,
  MCP_ADMIN_FEEDBACK_PRIVACY_EXCLUSIONS,
  MCP_ADMIN_FEEDBACK_PROCESSORS,
  MCP_ADMIN_FEEDBACK_PACKET_TYPES,
  MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
  MCP_ADMIN_FEEDBACK_READ_OAUTH_SCOPE,
  MCP_ADMIN_FEEDBACK_REPORT_TYPES,
  MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
  MCP_ADMIN_FEEDBACK_SCHEMA_CONTRACT_VERSION,
  MCP_ADMIN_FEEDBACK_SCHEMA_PACKAGE,
  MCP_ADMIN_FEEDBACK_SATISFACTION_WINDOWS,
  MCP_ADMIN_FOUNDATION_ENV_VAR,
  MCP_ADMIN_FOUNDATION_FLAG_ID,
  MCP_ADMIN_PRODUCTION_READINESS_ENV_VAR,
  MCP_ADMIN_PRODUCTION_READINESS_FLAG_ID,
  MCP_ADMIN_REGISTRY_SOURCE,
  MCP_ASSET_CATALOG_REQUEST_CAPABILITY,
  MCP_ASSET_EXTERNAL_HARVEST_FLAG_ID,
  MCP_ASSET_PIPELINE_FLAG_ID,
  MCP_ASSET_PROCESSING_OPERATIONS,
  MCP_ASSET_REVIEW_KINDS,
  MCP_ASSET_SOURCE_ADAPTERS,
  MCP_ADMIN_USER_AGGREGATION_DIMENSIONS,
  MCP_ADMIN_USER_AGGREGATION_METRICS,
  MCP_ADMIN_USER_AGGREGATION_PRESETS,
  MCP_ACCESS_SCOPE,
  MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
  ECONOMY_ADMIN_HISTORY_FLAG_ID,
  MCP_ADMIN_ECONOMY_READ_CAPABILITY,
  ECONOMY_FINANCE_OPERATIONS_VIEW_CAPABILITY,
  MCP_ADMIN_TOKEN_ACTIVITY_SOURCES,
  MCP_ADMIN_TOKEN_ACTIVITY_STATUSES,
  MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
  MCP_ADMIN_TOKEN_WALLET_COMPONENTS,
  MCP_ADMIN_TOKEN_WALLET_SORTS,
  MCP_ADMIN_TOKEN_WALLET_STATUSES,
  MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
  MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY,
  MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY,
  MCP_ECONOMY_FINANCE_VIEW_CAPABILITY,
} from "../src/index.js";

interface CanonicalSchemaFieldMetadata {
  isRequired: boolean;
  enumValues?: readonly unknown[];
  itemType?: CanonicalSchemaFieldMetadata;
  _shape?: Record<string, CanonicalSchemaFieldMetadata>;
}

interface CanonicalSchemaMetadata {
  meta: { entityType: string; version: string };
  _shape: Record<string, CanonicalSchemaFieldMetadata>;
}

const asCanonicalSchema = (schema: unknown): CanonicalSchemaMetadata =>
  schema as CanonicalSchemaMetadata;

const partitionCanonicalSchema = (
  schema: CanonicalSchemaMetadata,
): { required: string[]; optional: string[] } => ({
  required: Object.entries(schema._shape)
    .filter(([, field]) => field.isRequired)
    .map(([key]) => key)
    .sort(),
  optional: Object.entries(schema._shape)
    .filter(([, field]) => !field.isRequired)
    .map(([key]) => key)
    .sort(),
});

const canonicalStringEnum = (
  field: CanonicalSchemaFieldMetadata | undefined,
): string[] => {
  const values = field?.enumValues;
  expect(values).toBeDefined();
  expect(values?.every((value) => typeof value === "string")).toBe(true);
  return [...(values as readonly string[])];
};

const canonicalBugPacket = asCanonicalSchema(FeedbackBugPacketSchema);
const canonicalReviewPacket = asCanonicalSchema(FeedbackReviewPacketSchema);
const canonicalHourlyBugReport = asCanonicalSchema(
  FeedbackHourlyBugReportSchema,
);
const canonicalDailySatisfactionReport = asCanonicalSchema(
  FeedbackDailySatisfactionReportSchema,
);
const canonicalProcessorCheckpoint = asCanonicalSchema(
  FeedbackProcessorCheckpointSchema,
);

const CANONICAL_FEEDBACK_UUID_V4_PATTERN =
  "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";

const objectProperties = (field: McpFieldShape): Record<string, McpFieldShape> => {
  expect(field.type).toBe("object");
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

const partitionFieldKeys = (
  fields: Record<string, McpFieldShape>,
): { required: string[]; optional: string[] } => ({
  required: Object.entries(fields)
    .filter(([, field]) => field.required !== false)
    .map(([key]) => key)
    .sort(),
  optional: Object.entries(fields)
    .filter(([, field]) => field.required === false)
    .map(([key]) => key)
    .sort(),
});

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

const collectObjectFields = (field: McpFieldShape): McpFieldShape[] => [
  ...(field.type === "object" ? [field] : []),
  ...Object.values(field.properties ?? {}).flatMap(collectObjectFields),
  ...(field.items === undefined ? [] : collectObjectFields(field.items)),
  ...(field.oneOf ?? []).flatMap(collectObjectFields),
];

describe("MCP admin contracts", () => {
  it("builds the approved discovery response without placeholder tools", () => {
    const response = buildMcpDiscoveryResponse();

    expect(response.contractVersion).toBe(MCP_ADMIN_CONTRACT_VERSION);
    expect(response.sourceOfTruth).toBe(MCP_ADMIN_REGISTRY_SOURCE);
    expect(response.actions).toHaveLength(MCP_ADMIN_ACTIONS.length);
    expect(response.actions.map((action) => action.name)).toContain("listFeatureFlags");
    expect(response.actions.map((action) => action.name)).toContain("searchAssetCatalog");
    expect(response.actions.map((action) => action.name)).toContain("promoteAsset");
    expect(response.actions.map((action) => action.name)).toContain(
      "getFeedbackBugHealth",
    );
    expect(response.actions[0]).toMatchObject({
      descriptionKey: mcpAdminContractDescriptionKeys.actionListFeatureFlags,
      descriptionDefault:
        mcpAdminContractsEnGbTranslations[
          mcpAdminContractDescriptionKeys.actionListFeatureFlags
        ],
    });
    expect(response.actions.map((action) => action.name)).not.toContain("createPost");
    expect(response.actions.map((action) => action.name)).not.toContain("randomNumber");
  });

  it("keeps legacy env constants source-compatible without using them for action rollout", () => {
    expect(MCP_ADMIN_FOUNDATION_ENV_VAR).toBe("MCP_ADMIN_FOUNDATION_ENABLED");
    expect(MCP_ADMIN_PRODUCTION_READINESS_ENV_VAR).toBe(
      "MCP_ADMIN_PRODUCTION_READINESS_ENABLED",
    );

    const schema = buildMcpSchemaResponse();
    const actionRolloutFlags = Object.values(schema.actions).map(
      (action) => action.rolloutFlag,
    );

    expect(MCP_ADMIN_PRODUCTION_READINESS_FLAG_ID).toBe(
      "mcp.admin.production-readiness.enabled",
    );
    expect(
      actionRolloutFlags.some((rolloutFlag) => rolloutFlag.endsWith(".enabled")),
    ).toBe(true);
    expect(
      actionRolloutFlags.some((rolloutFlag) => rolloutFlag === MCP_ADMIN_FOUNDATION_ENV_VAR),
    ).toBe(false);
    expect(
      actionRolloutFlags.some(
        (rolloutFlag) => rolloutFlag === MCP_ADMIN_PRODUCTION_READINESS_ENV_VAR,
      ),
    ).toBe(false);
  });

  it("exposes action input and output shapes in the schema response", () => {
    const schema = buildMcpSchemaResponse();
    const listFeatureFlags = schema.actions.listFeatureFlags!;
    const enableFeatureFlag = schema.actions.enableFeatureFlag!;
    const listCapabilities = schema.actions.listCapabilities!;
    const getCapability = schema.actions.getCapability!;
    const assignCapability = schema.actions.assignCapability!;
    const unassignCapability = schema.actions.unassignCapability!;
    const updateCapability = schema.actions.updateCapability!;
    const runAnalyticsQuery = schema.actions.runAnalyticsQuery!;
    const runAnalyticsPreset = schema.actions.runAnalyticsPreset!;
    const aggregateUsers = schema.actions.aggregateUsers!;
    const aggregateUsersByPreset = schema.actions.aggregateUsersByPreset!;
    const listAnalyticsMetrics = schema.actions.listAnalyticsMetrics!;
    const listAnalyticsDimensions = schema.actions.listAnalyticsDimensions!;
    const listAggregationMetrics = schema.actions.listAggregationMetrics!;
    const listAggregationDimensions = schema.actions.listAggregationDimensions!;
    const searchAssetCatalog = schema.actions.searchAssetCatalog!;
    const getAssetManifest = schema.actions.getAssetManifest!;
    const requestAsset = schema.actions.requestAsset!;
    const searchAssetSources = schema.actions.searchAssetSources!;
    const stageAssetSource = schema.actions.stageAssetSource!;
    const createAssetJob = schema.actions.createAssetJob!;
    const processAssetJob = schema.actions.processAssetJob!;
    const renderAssetReview = schema.actions.renderAssetReview!;
    const reviewAssetCandidate = schema.actions.reviewAssetCandidate!;
    const promoteAsset = schema.actions.promoteAsset!;
    const rollbackAsset = schema.actions.rollbackAsset!;
    const getAssetJobStatus = schema.actions.getAssetJobStatus!;
    const getFeedbackBugHealth = schema.actions.getFeedbackBugHealth!;
    const getFeedbackSatisfaction = schema.actions.getFeedbackSatisfaction!;
    const listFeedbackAlerts = schema.actions.listFeedbackAlerts!;
    const getFeedbackFreshness = schema.actions.getFeedbackFreshness!;
    const listFeedbackStructuredEntries =
      schema.actions.listFeedbackStructuredEntries!;

    expect(listFeatureFlags.execution.path).toBe("/api/mcp/feature-flags");
    expect(enableFeatureFlag.input.flagKey!.required).toBe(true);
    expect(listCapabilities.output.items!.description).toContain("ruleKey");
    expect(getCapability.output.item!.properties?.capabilityKey?.description).toContain(
      "effective-capability",
    );
    expect(assignCapability.verification?.query).toContain(
      "targetId={resolvedRuleId}",
    );
    expect(unassignCapability.input.service!.required).toBe(true);
    expect(unassignCapability.input.ruleId!.required).toBe(false);
    expect(updateCapability.input.ruleId!.required).toBe(false);
    expect(runAnalyticsQuery.input.metric!.required).toBe(true);
    expect(runAnalyticsQuery.input.metric!.enum).toEqual(
      MCP_ADMIN_ANALYTICS_METRICS,
    );
    expect(runAnalyticsQuery.input.dimension!.enum).toEqual(
      MCP_ADMIN_ANALYTICS_DIMENSIONS,
    );
    expect(runAnalyticsPreset.input.preset!.enum).toEqual(
      MCP_ADMIN_ANALYTICS_PRESETS,
    );
    expect(aggregateUsers.execution.path).toBe("/api/users/admin/aggregation");
    expect(aggregateUsers.input.metric!.enum).toEqual(
      MCP_ADMIN_USER_AGGREGATION_METRICS,
    );
    expect(aggregateUsers.input.dimension!.enum).toEqual(
      MCP_ADMIN_USER_AGGREGATION_DIMENSIONS,
    );
    expect(aggregateUsersByPreset.input.preset!.enum).toEqual(
      MCP_ADMIN_USER_AGGREGATION_PRESETS,
    );
    expect(listAnalyticsMetrics.output.items!.enum).toEqual(
      MCP_ADMIN_ANALYTICS_METRICS,
    );
    expect(listAnalyticsDimensions.output.items!.enum).toEqual(
      MCP_ADMIN_ANALYTICS_DIMENSIONS,
    );
    expect(listAggregationMetrics.output.items!.enum).toEqual(
      MCP_ADMIN_USER_AGGREGATION_METRICS,
    );
    expect(listAggregationDimensions.output.items!.enum).toEqual(
      MCP_ADMIN_USER_AGGREGATION_DIMENSIONS,
    );
    expect(searchAssetCatalog.domain).toBe("assetCatalog");
    expect(searchAssetCatalog.rolloutFlag).toBe(MCP_ASSET_PIPELINE_FLAG_ID);
    expect(searchAssetCatalog.execution.path).toBe("/api/mcp/assets/catalog");
    expect(searchAssetCatalog.output.capability!.description).toContain(
      MCP_ASSET_CATALOG_REQUEST_CAPABILITY,
    );
    expect(getAssetManifest.execution.path).toBe(
      "/api/mcp/assets/catalog/{assetId}/manifest",
    );
    expect(requestAsset.execution.notes?.join(" ")).toContain("live external source");
    expect(searchAssetSources.rolloutFlag).toBe(MCP_ASSET_EXTERNAL_HARVEST_FLAG_ID);
    expect(searchAssetSources.input.sourceId!.enum).toEqual(MCP_ASSET_SOURCE_ADAPTERS);
    expect(stageAssetSource.input.sourceId!.enum).toEqual(MCP_ASSET_SOURCE_ADAPTERS);
    expect(createAssetJob.input.sourceAdapter!.enum).toContain("external-import");
    expect(processAssetJob.input.operations!.enum).toEqual(MCP_ASSET_PROCESSING_OPERATIONS);
    expect(renderAssetReview.input.captureKinds!.enum).toEqual(MCP_ASSET_REVIEW_KINDS);
    expect(reviewAssetCandidate.input.decision!.enum).toEqual([
      "approved",
      "rejected",
      "needs-changes",
    ]);
    expect(promoteAsset.verification?.query).toContain("targetId={jobId}");
    expect(rollbackAsset.input.destructiveConfirmationToken!.required).toBe(true);
    expect(getAssetJobStatus.output.job!.properties?.state?.description).toContain(
      "pipeline",
    );
    expect(getFeedbackBugHealth.domain).toBe("feedback");
    expect(getFeedbackBugHealth.rolloutFlag).toBe(MCP_ADMIN_FEEDBACK_FLAG_ID);
    expect(getFeedbackBugHealth.requiredCapability).toBe(
      MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
    );
    expect(getFeedbackBugHealth.oauthScopes).toEqual(
      MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
    );
    expect(getFeedbackBugHealth.schemaSource).toEqual({
      packageName: MCP_ADMIN_FEEDBACK_SCHEMA_PACKAGE,
      contractVersion: MCP_ADMIN_FEEDBACK_SCHEMA_CONTRACT_VERSION,
      schemaNames: ["FeedbackHourlyBugReportSchema"],
    });
    expect(getFeedbackBugHealth.input.window!.enum).toEqual(
      MCP_ADMIN_FEEDBACK_BUG_HEALTH_WINDOWS,
    );
    expect(getFeedbackBugHealth.output.reports).toMatchObject({
      itemType: "FeedbackHourlyBugReport",
      maxItems: 168,
    });
    expect(getFeedbackSatisfaction.input.window!.enum).toEqual(
      MCP_ADMIN_FEEDBACK_SATISFACTION_WINDOWS,
    );
    expect(getFeedbackSatisfaction.output.reports).toMatchObject({
      itemType: "FeedbackDailySatisfactionReport",
      maxItems: 90,
    });
    expect(listFeedbackAlerts.input.window!.enum).toEqual(
      MCP_ADMIN_FEEDBACK_ALERT_WINDOWS,
    );
    expect(listFeedbackAlerts.input.limit).toMatchObject({
      minimum: 1,
      maximum: MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE,
    });
    expect(listFeedbackAlerts.input.cursor).toMatchObject({
      minLength: 1,
      maxLength: MCP_ADMIN_FEEDBACK_MAX_CURSOR_LENGTH,
      pattern: "^[A-Za-z0-9_-]+$",
    });
    expect(listFeedbackAlerts.output.items!.maxItems).toBe(
      MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE,
    );
    expect(
      listFeedbackAlerts.output.metadata!.properties?.returnedCount?.maximum,
    ).toBe(MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE);
    expect(listFeedbackAlerts.input.reportType!.enum).toEqual(
      MCP_ADMIN_FEEDBACK_REPORT_TYPES,
    );
    expect(getFeedbackFreshness.input.processor!.enum).toEqual(
      MCP_ADMIN_FEEDBACK_PROCESSORS,
    );
    expect(getFeedbackFreshness.output.processors!.maxItems).toBe(
      MCP_ADMIN_FEEDBACK_PROCESSORS.length,
    );
    expect(listFeedbackStructuredEntries.input).toEqual({
      filters: expect.objectContaining({
        type: "discriminated-union",
        required: true,
        discriminator: "packetType",
      }),
    });
    expect(listFeedbackStructuredEntries.output.items).toMatchObject({
      maxItems: MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE,
      itemType: "FeedbackPacket",
    });
    expect(listFeedbackStructuredEntries.output.items!.items).toMatchObject({
      type: "discriminated-union",
      discriminator: "type",
    });
    expect(schema.contextShape.extensionRules!.properties?.notes?.itemType).toBe("string");
    expect(enableFeatureFlag.verification?.descriptionKey).toBe(
      mcpAdminContractDescriptionKeys.verificationEnableFeatureFlag,
    );
    expect(Object.keys(schema.actions)).not.toContain("randomNumber");
  });

  it("exposes translation metadata for every MCP action description", () => {
    for (const action of MCP_ADMIN_ACTIONS) {
      expect(action.description).toBe(action.descriptionDefault);
      expect(action.descriptionDefault).toBe(
        mcpAdminContractsEnGbTranslations[action.descriptionKey],
      );
      expect(action.descriptionKey).toMatch(/^mcpAdminContracts\.action\./);

      if (action.verification) {
        expect(action.verification.description).toBe(
          action.verification.descriptionDefault,
        );
        expect(action.verification.descriptionDefault).toBe(
          mcpAdminContractsEnGbTranslations[action.verification.descriptionKey],
        );
        expect(action.verification.descriptionKey).toMatch(
          /^mcpAdminContracts\.verification\./,
        );
      }
    }
  });

  it("publishes bounded read-only Token activity and trend descriptors", () => {
    const schema = buildMcpSchemaResponse();
    const activity = schema.actions.list_admin_token_activity!;
    const trends = schema.actions.get_admin_token_trends!;
    const discoveryActivity = buildMcpDiscoveryResponse().actions.find(
      (action) => action.name === "list_admin_token_activity",
    );

    expect(activity).toMatchObject({
      domain: "economy",
      rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
      availability: "near-future",
      execution: {
        method: "GET",
        path: "/api/mcp/economy/token-activity",
        source: "near-future-route",
      },
      access: {
        oauthScopes: [MCP_ACCESS_SCOPE],
        capabilities: [
          MCP_ADMIN_ECONOMY_READ_CAPABILITY,
          ECONOMY_FINANCE_OPERATIONS_VIEW_CAPABILITY,
        ],
        rolloutFlags: [
          ECONOMY_ADMIN_HISTORY_FLAG_ID,
          MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
        ],
        mode: "read-only",
        identityResolution: "not-available",
      },
    });
    expect(discoveryActivity?.access).toEqual(activity.access);
    expect(activity.input.limit).toMatchObject({
      minimum: 1,
      maximum: 100,
      default: 100,
    });
    expect(activity.input.lookbackDays).toMatchObject({
      minimum: 1,
      maximum: 365,
      default: 30,
    });
    expect(activity.input.activityTypes?.enum).toEqual(
      MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
    );
    expect(activity.input.statuses?.enum).toEqual(
      MCP_ADMIN_TOKEN_ACTIVITY_STATUSES,
    );
    expect(activity.input.sources?.enum).toEqual(
      MCP_ADMIN_TOKEN_ACTIVITY_SOURCES,
    );
    expect(MCP_ADMIN_TOKEN_ACTIVITY_SOURCES.join(" ")).not.toMatch(
      /shopify|ayet|bitlabs/u,
    );
    expect(activity.output.items?.items?.properties).toEqual(
      expect.objectContaining({
        occurredAt: expect.any(Object),
        activityType: expect.any(Object),
        status: expect.any(Object),
        source: expect.any(Object),
        amount: expect.any(Object),
        safeLabel: expect.any(Object),
        rowAlias: expect.any(Object),
        subjectAlias: expect.any(Object),
      }),
    );
    expect(activity.output.items?.maxItems).toBe(100);
    expect(
      Object.keys(activity.output.items?.items?.properties ?? {}),
    ).not.toEqual(
      expect.arrayContaining([
        "accountId",
        "walletId",
        "transactionId",
        "orderId",
        "providerEventId",
        "idempotencyKey",
      ]),
    );
    expect(activity.output.metadata?.properties).toMatchObject({
      audience: expect.objectContaining({ enum: ["mcp-token-activity"] }),
      pseudonymVersion: expect.any(Object),
      rawIdentifiersIncluded: expect.objectContaining({ default: false }),
    });

    expect(trends).toMatchObject({
      domain: "economy",
      rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
      access: activity.access,
      execution: {
        method: "GET",
        path: "/api/mcp/economy/token-trends",
        source: "near-future-route",
      },
    });
    expect(trends.input.granularity?.enum).toEqual(["hour", "day"]);
    expect(trends.output.series?.maxItems).toBe(1_000);
    expect(trends.output.series?.items?.properties).toMatchObject({
      bucketStart: expect.any(Object),
      bucketEnd: expect.any(Object),
      activityType: expect.objectContaining({
        enum: MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
      }),
      aggregate: expect.objectContaining({
        properties: expect.objectContaining({
          visibility: expect.objectContaining({
            enum: ["reported", "suppressed"],
          }),
          signedAmount: expect.any(Object),
        }),
      }),
      anomaly: expect.objectContaining({
        properties: expect.objectContaining({
          method: expect.objectContaining({
            enum: ["same-window-median-mad-v1"],
          }),
          status: expect.objectContaining({
            enum: ["normal", "irregular-spike"],
          }),
        }),
      }),
    });
    expect(trends.output.metadata?.properties).toMatchObject({
      minimumCohortSize: expect.objectContaining({
        minimum: 5,
        maximum: 5,
        default: 5,
      }),
      anomalyBaselineDays: expect.objectContaining({
        minimum: 28,
        maximum: 28,
        default: 28,
      }),
      rawIdentifiersIncluded: expect.objectContaining({ default: false }),
    });
    expect(Object.keys(schema.actions)).not.toContain(
      "resolve_admin_token_subject",
    );
  });

  it("publishes identifier-free global summary and pseudonymous wallet balances", () => {
    const schema = buildMcpSchemaResponse();
    const overview = schema.actions.get_admin_token_economy_overview!;
    const wallets = schema.actions.list_admin_token_wallet_balances!;
    const activity = schema.actions.list_admin_token_activity!;

    expect(overview).toMatchObject({
      domain: "economy",
      rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
      availability: "near-future",
      access: activity.access,
      execution: {
        method: "GET",
        path: "/api/mcp/economy/token-overview",
        source: "near-future-route",
      },
      input: {},
    });
    expect(overview.output).toEqual(
      expect.objectContaining({
        schemaVersion: expect.any(Object),
        generatedAt: expect.any(Object),
        projectionAsOf: expect.any(Object),
        authoritySequence: expect.any(Object),
        walletCount: expect.any(Object),
        activeWalletCount: expect.any(Object),
        balances: expect.objectContaining({
          properties: expect.objectContaining({
            available: expect.any(Object),
            reserved: expect.any(Object),
            held: expect.any(Object),
            rewardProgress: expect.any(Object),
          }),
        }),
        lifetime: expect.objectContaining({
          properties: expect.objectContaining({
            bought: expect.any(Object),
            earned: expect.any(Object),
            allocated: expect.any(Object),
            reclaimed: expect.any(Object),
            spent: expect.any(Object),
            reversed: expect.any(Object),
          }),
        }),
        rawIdentifiersIncluded: expect.objectContaining({ default: false }),
      }),
    );
    expect(Object.keys(overview.output)).not.toEqual(
      expect.arrayContaining([
        "accountId",
        "walletId",
        "providerId",
        "orderId",
        "paymentId",
      ]),
    );

    expect(wallets).toMatchObject({
      domain: "economy",
      rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
      availability: "near-future",
      access: activity.access,
      execution: {
        method: "GET",
        path: "/api/mcp/economy/token-wallet-balances",
        source: "near-future-route",
      },
    });
    expect(wallets.input.limit).toMatchObject({
      minimum: 1,
      maximum: 100,
      default: 100,
    });
    expect(wallets.input.components?.enum).toEqual(
      MCP_ADMIN_TOKEN_WALLET_COMPONENTS,
    );
    expect(wallets.input.statuses?.enum).toEqual(
      MCP_ADMIN_TOKEN_WALLET_STATUSES,
    );
    expect(wallets.input.sort?.enum).toEqual(MCP_ADMIN_TOKEN_WALLET_SORTS);
    expect(wallets.output.items?.items?.properties).toEqual(
      expect.objectContaining({
        walletAlias: expect.any(Object),
        subjectAlias: expect.any(Object),
        component: expect.any(Object),
        status: expect.any(Object),
        available: expect.any(Object),
        reserved: expect.any(Object),
        held: expect.any(Object),
        rewardProgress: expect.any(Object),
        updatedAt: expect.any(Object),
        authoritySequence: expect.any(Object),
      }),
    );
    expect(wallets.output.metadata?.properties).toMatchObject({
      audience: expect.objectContaining({ enum: ["mcp-token-balances"] }),
      rawIdentifiersIncluded: expect.objectContaining({ default: false }),
    });
    expect(Object.keys(wallets.output.items?.items?.properties ?? {})).not.toEqual(
      expect.arrayContaining([
        "accountId",
        "walletId",
        "householdId",
        "email",
        "displayName",
      ]),
    );
  });

  it("publishes a read-only, bounded and immutable feedback registry", () => {
    expect(MCP_ADMIN_CONTRACT_VERSION).toBe("2026-08-11.v6");
    expect(Object.isFrozen(MCP_ADMIN_FEEDBACK_ACTIONS)).toBe(true);
    expect(Object.isFrozen(MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES)).toBe(
      true,
    );
    expect(MCP_ADMIN_FEEDBACK_ACTIONS.map((action) => action.name)).toEqual([
      "getFeedbackBugHealth",
      "getFeedbackSatisfaction",
      "listFeedbackAlerts",
      "getFeedbackFreshness",
      "listFeedbackStructuredEntries",
    ]);

    for (const action of MCP_ADMIN_FEEDBACK_ACTIONS) {
      expect(Object.isFrozen(action)).toBe(true);
      expect(Object.isFrozen(action.input)).toBe(true);
      expect(Object.isFrozen(action.output)).toBe(true);
      expect(action.domain).toBe("feedback");
      expect(action.rolloutFlag).toBe(MCP_ADMIN_FEEDBACK_FLAG_ID);
      expect(action.requiredCapability).toBe(
        MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
      );
      expect(action.oauthScopes).toEqual(
        MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
      );
      expect(action.access).toEqual({
        oauthScopes: MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
        capabilities: [MCP_ADMIN_FEEDBACK_READ_CAPABILITY],
        rolloutFlags: [MCP_ADMIN_FEEDBACK_FLAG_ID],
        mode: "read-only",
        identityResolution: "not-available",
      });
      expect(action.schemaSource?.packageName).toBe(
        MCP_ADMIN_FEEDBACK_SCHEMA_PACKAGE,
      );
      expect(action.execution.method).toBe("GET");
      expect(action.execution.path).toMatch(/^\/api\/admin\/feedback\//);
      expect(action.privacy).toMatchObject({
        classification: "public-safe-structured-only",
        readOnly: true,
        bounded: true,
        excludes: MCP_ADMIN_FEEDBACK_PRIVACY_EXCLUSIONS,
      });
      expect(Object.isFrozen(action.privacy?.excludes)).toBe(true);
    }

    const discovery = buildMcpDiscoveryResponse();
    const feedbackSummary = discovery.actions.find(
      (action) => action.name === "getFeedbackBugHealth",
    )!;
    expect(feedbackSummary).toMatchObject({
      requiredCapability: MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
      oauthScopes: MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
      access: {
        oauthScopes: MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
        capabilities: [MCP_ADMIN_FEEDBACK_READ_CAPABILITY],
        rolloutFlags: [MCP_ADMIN_FEEDBACK_FLAG_ID],
        mode: "read-only",
        identityResolution: "not-available",
      },
      privacy: {
        readOnly: true,
        bounded: true,
        excludes: MCP_ADMIN_FEEDBACK_PRIVACY_EXCLUSIONS,
      },
    });

    feedbackSummary.name = "tampered-copy";
    expect(
      buildMcpDiscoveryResponse().actions.some(
        (action) => action.name === "getFeedbackBugHealth",
      ),
    ).toBe(true);
    expect(MCP_ADMIN_FEEDBACK_ACTIONS[0]!.name).toBe("getFeedbackBugHealth");
  });

  it("publishes exact packetType-discriminated structured-entry query filters", () => {
    const runtimeAction = MCP_ADMIN_FEEDBACK_ACTIONS.find(
      (action) => action.name === "listFeedbackStructuredEntries",
    )!;
    const runtimeFilters = runtimeAction.input.filters!;
    const schemaFilters =
      buildMcpSchemaResponse().actions.listFeedbackStructuredEntries!.input
        .filters!;

    expect(Object.keys(runtimeAction.input)).toEqual(["filters"]);
    expect(runtimeFilters).toMatchObject({
      type: "discriminated-union",
      required: true,
      discriminator: "packetType",
    });
    expect(runtimeFilters.oneOf).toHaveLength(2);
    expect(schemaFilters).toEqual(runtimeFilters);
    expect(Object.isFrozen(runtimeFilters)).toBe(true);
    expect(Object.isFrozen(runtimeFilters.oneOf)).toBe(true);

    const bugFiltersField = unionVariant(
      runtimeFilters,
      MCP_ADMIN_FEEDBACK_PACKET_TYPES[0],
    );
    const reviewFiltersField = unionVariant(
      runtimeFilters,
      MCP_ADMIN_FEEDBACK_PACKET_TYPES[1],
    );
    const bugFilters = objectProperties(bugFiltersField);
    const reviewFilters = objectProperties(reviewFiltersField);

    expect(bugFiltersField.additionalProperties).toBe(false);
    expect(reviewFiltersField.additionalProperties).toBe(false);
    expect(partitionFieldKeys(bugFilters)).toEqual({
      required: ["packetType", "window"],
      optional: ["buildId", "cursor", "limit", "severity", "surfaceId"],
    });
    expect(partitionFieldKeys(reviewFilters)).toEqual({
      required: ["packetType", "window"],
      optional: ["cursor", "limit", "satisfaction"],
    });
    expect(Object.keys(bugFilters).sort()).toEqual([
      "buildId",
      "cursor",
      "limit",
      "packetType",
      "severity",
      "surfaceId",
      "window",
    ]);
    expect(Object.keys(reviewFilters).sort()).toEqual([
      "cursor",
      "limit",
      "packetType",
      "satisfaction",
      "window",
    ]);
    expect(bugFilters.packetType).toMatchObject({
      constValue: "feedback-bug-packet",
      enum: ["feedback-bug-packet"],
    });
    expect(reviewFilters.packetType).toMatchObject({
      constValue: "feedback-review-packet",
      enum: ["feedback-review-packet"],
    });
    expect(bugFilters).not.toHaveProperty("satisfaction");
    expect(reviewFilters).not.toHaveProperty("surfaceId");
    expect(reviewFilters).not.toHaveProperty("buildId");
    expect(reviewFilters).not.toHaveProperty("severity");

    for (const variant of [bugFilters, reviewFilters]) {
      expect(variant.window?.enum).toEqual(MCP_ADMIN_FEEDBACK_ENTRY_WINDOWS);
      expect(variant.limit).toMatchObject({
        minimum: 1,
        maximum: MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE,
      });
      expect(variant.cursor).toMatchObject({
        minLength: 1,
        maxLength: MCP_ADMIN_FEEDBACK_MAX_CURSOR_LENGTH,
        pattern: "^[A-Za-z0-9_-]+$",
      });
    }

    const discoveryAction = buildMcpDiscoveryResponse().actions.find(
      (action) => action.name === "listFeedbackStructuredEntries",
    )!;
    expect(discoveryAction.execution).toMatchObject({
      method: "GET",
      path: "/api/admin/feedback/entries",
      source: "near-future-route",
    });
    expect(discoveryAction.execution.notes).toContain(
      "The runtime must validate `filters` against exactly one closed `packetType` variant, reject cross-packet or unknown fields, and only then map that variant to route query parameters.",
    );
  });

  it("matches canonical @plasius/schema bug and review packet projections", () => {
    expect(FEEDBACK_CONTRACT_VERSION).toBe(
      MCP_ADMIN_FEEDBACK_SCHEMA_CONTRACT_VERSION,
    );

    const entries =
      buildMcpSchemaResponse().actions.listFeedbackStructuredEntries!;
    expect(entries.schemaSource).toEqual({
      packageName: MCP_ADMIN_FEEDBACK_SCHEMA_PACKAGE,
      contractVersion: FEEDBACK_CONTRACT_VERSION,
      schemaNames: [
        "FeedbackBugPacketSchema",
        "FeedbackReviewPacketSchema",
      ],
    });
    const packetUnion = entries.output.items!.items!;
    expect(packetUnion.discriminator).toBe("type");
    expect(packetUnion.oneOf).toHaveLength(2);

    for (const packetSchema of [canonicalBugPacket, canonicalReviewPacket]) {
      const packet = unionVariant(packetUnion, packetSchema.meta.entityType);
      const properties = objectProperties(packet);
      expect(partitionFieldKeys(properties)).toEqual(
        partitionCanonicalSchema(packetSchema),
      );
      expect(properties.type?.constValue).toBe(packetSchema.meta.entityType);
      expect(properties.version?.constValue).toBe(packetSchema.meta.version);
      expect(properties.packetId?.pattern).toBe(
        CANONICAL_FEEDBACK_UUID_V4_PATTERN,
      );
    }

    const bugPacket = objectProperties(
      unionVariant(packetUnion, "feedback-bug-packet"),
    );
    expect(bugPacket.surfaceId?.enum).toEqual(FEEDBACK_SURFACE_IDS);
    expect(bugPacket.issueType?.enum).toEqual(
      FEEDBACK_PERSISTABLE_ISSUE_TYPES,
    );
    expect(bugPacket.severity).toMatchObject({ minimum: 1, maximum: 5 });
    expect(bugPacket.releaseId).toMatchObject({
      minLength: 1,
      maxLength: 128,
      pattern: "^[A-Za-z0-9][A-Za-z0-9._:-]*$",
    });
    expect(bugPacket.buildId).toMatchObject({
      minLength: 1,
      maxLength: 128,
      pattern: "^[A-Za-z0-9][A-Za-z0-9._:-]*$",
    });

    const analysis = bugPacket.analysis!;
    expect(analysis.required).toBe(false);
    const analyzed = objectProperties(unionVariant(analysis, "analyzed"));
    expect(analyzed.sentiment?.enum).toEqual(FEEDBACK_SENTIMENT_BUCKETS);
    expect(analyzed.intentIds?.items?.enum).toEqual(FEEDBACK_INTENT_IDS);
    expect(analyzed.intentIds?.maxItems).toBe(8);
    expect(analyzed.themeIds?.items?.enum).toEqual(FEEDBACK_THEME_IDS);
    expect(analyzed.themeIds?.maxItems).toBe(8);
    expect(analyzed.confidence?.enum).toEqual(["low", "medium", "high"]);

    const structuredOnly = objectProperties(
      unionVariant(analysis, "structured-only"),
    );
    expect(structuredOnly).not.toHaveProperty("sentiment");
    expect(structuredOnly).not.toHaveProperty("confidence");
    expect(structuredOnly.intentIds?.maxItems).toBe(0);
    expect(structuredOnly.themeIds?.maxItems).toBe(0);

    const diagnostics = bugPacket.gameDiagnostics!;
    expect(diagnostics.required).toBe(false);
    expect(diagnostics.discriminator).toBe("surfaceId");
    const generatorDiagnostics = objectProperties(
      unionVariant(diagnostics, "site.generator"),
    );
    expect(generatorDiagnostics.provenanceContractId?.constValue).toBe(
      "generator.renderer-diagnostics.v1",
    );
    expect(generatorDiagnostics.renderer?.enum).toEqual(
      FEEDBACK_RENDERER_BUCKETS,
    );
    expect(generatorDiagnostics.backend?.enum).toEqual(
      FEEDBACK_BACKEND_BUCKETS,
    );
    expect(generatorDiagnostics.viewportBucket?.enum).toEqual(
      FEEDBACK_VIEWPORT_BUCKETS,
    );
    expect(generatorDiagnostics.frameRateBucket?.enum).toEqual(
      FEEDBACK_FRAME_RATE_BUCKETS,
    );
    expect(generatorDiagnostics.frameTimeBucket?.enum).toEqual(
      FEEDBACK_FRAME_TIME_BUCKETS,
    );
    expect(generatorDiagnostics.featureIds?.items?.enum).toEqual(
      FEEDBACK_GAME_FEATURE_IDS,
    );
    expect(generatorDiagnostics.errorCodes?.items?.enum).toEqual(
      FEEDBACK_GAME_ERROR_CODES,
    );
    expect(
      generatorDiagnostics.counters?.items?.properties?.code?.enum,
    ).toEqual(FEEDBACK_GAME_COUNTER_CODES);

    const reviewPacket = objectProperties(
      unionVariant(packetUnion, "feedback-review-packet"),
    );
    expect(reviewPacket).not.toHaveProperty("surfaceId");
    expect(reviewPacket).not.toHaveProperty("issueType");
    expect(reviewPacket).not.toHaveProperty("severity");
    expect(reviewPacket).not.toHaveProperty("buildId");
    expect(reviewPacket.satisfaction).toMatchObject({
      minimum: 1,
      maximum: 5,
    });

    const canonicalBugValue = {
      type: canonicalBugPacket.meta.entityType,
      version: canonicalBugPacket.meta.version,
      packetId: "11111111-1111-4111-8111-111111111111",
      acceptedAt: "2026-08-13T11:00:00.000Z",
      surfaceId: FEEDBACK_SURFACE_IDS[0],
      issueType: FEEDBACK_PERSISTABLE_ISSUE_TYPES[0],
      severity: 1,
      releaseId: "release-1",
      buildId: "build-1",
    };
    expect(FeedbackBugPacketSchema.validate(canonicalBugValue).valid).toBe(
      true,
    );
    expect(
      FeedbackBugPacketSchema.validate({
        ...canonicalBugValue,
        packetId: "11111111-1111-4111-A111-111111111111",
      }).valid,
    ).toBe(false);
    expect(
      FeedbackBugPacketSchema.validate({
        ...canonicalBugValue,
        surfaceId: "https://example.invalid/private",
      }).valid,
    ).toBe(false);
    expect(
      FeedbackBugPacketSchema.validate({
        ...canonicalBugValue,
        narrative: "synthetic forbidden field",
      }).valid,
    ).toBe(false);
  });

  it("consumes the published @plasius/schema ^1.4.0 contract directly", () => {
    const packageManifest = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    const packageLock = JSON.parse(
      readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
    ) as {
      packages?: Record<
        string,
        { version?: string; resolved?: string; integrity?: string; link?: boolean }
      >;
    };
    const readme = readFileSync(
      new URL("../README.md", import.meta.url),
      "utf8",
    );
    const adr = readFileSync(
      new URL(
        "../docs/adrs/adr-0005-privacy-safe-read-only-feedback-contract.md",
        import.meta.url,
      ),
      "utf8",
    );

    expect(packageManifest.dependencies?.["@plasius/schema"]).toBe("^1.4.0");
    expect(packageManifest.devDependencies ?? {}).not.toHaveProperty(
      "@plasius/schema",
    );
    expect(packageManifest.peerDependencies ?? {}).not.toHaveProperty(
      "@plasius/schema",
    );
    expect(packageLock.packages?.["node_modules/@plasius/schema"]).toMatchObject(
      {
        version: "1.4.0",
        resolved:
          "https://registry.npmjs.org/@plasius/schema/-/schema-1.4.0.tgz",
        integrity:
          "sha512-Qq6Ry36isxsb/HdWzGSvS+DnlbtEtURyDONk6czUI1eKUyzkw7LtPudLPrXMbqw8hVE31QzO7I9l/nr27G3Few==",
      },
    );
    expect(
      packageLock.packages?.["node_modules/@plasius/schema"]?.link,
    ).not.toBe(true);
    for (const document of [readme, adr]) {
      expect(document).toMatch(
        /directly\s+(?:import|imports|consume|consumes)(?:\s+the)?(?:\s+published)?\s+`@plasius\/schema \^1\.4\.0`/i,
      );
      expect(document).not.toMatch(/release (?:remains )?blocked/i);
    }
  });

  it("matches the canonical hourly bug-health aggregate", () => {
    const action = buildMcpSchemaResponse().actions.getFeedbackBugHealth!;
    const report = action.output.reports!.items!;
    const properties = objectProperties(report);
    const distributionMaximums = {
      targetDistribution: 256,
      issueTypeDistribution: 9,
      severityDistribution: 5,
      intentDistribution: 12,
      buildDistribution: 128,
      rendererDistribution: 4,
      backendDistribution: 3,
      viewportDistribution: 7,
      frameRateDistribution: 5,
      frameTimeDistribution: 5,
      diagnosticFeatureDistribution: 6,
      diagnosticCounterDistribution: 5,
      diagnosticErrorDistribution: 6,
      abuseBlockBands: 16,
    };
    const canonicalAdvisoryFields =
      canonicalHourlyBugReport._shape.advisories?.itemType?._shape;

    expect(action.schemaSource?.schemaNames).toEqual([
      "FeedbackHourlyBugReportSchema",
    ]);
    expect(partitionFieldKeys(properties)).toEqual(
      partitionCanonicalSchema(canonicalHourlyBugReport),
    );
    expect(properties.type?.constValue).toBe(
      canonicalHourlyBugReport.meta.entityType,
    );
    expect(properties.reportId?.pattern).toBe(
      CANONICAL_FEEDBACK_UUID_V4_PATTERN,
    );
    expect(properties.rates?.properties).toEqual(
      expect.objectContaining({
        rejectionRate: expect.objectContaining({ minimum: 0, maximum: 1 }),
        deterministicRedactionsPerAccepted: expect.objectContaining({
          minimum: 0,
          maximum: 4_000,
        }),
        scannerRedactionsPerAccepted: expect.objectContaining({
          minimum: 0,
          maximum: 4_000,
        }),
      }),
    );
    expect(properties.traffic?.properties).toEqual(
      expect.objectContaining({
        denominator: expect.objectContaining({
          minimum: 0,
          maximum: 1_000_000_000,
        }),
        acceptedPerTenThousand: expect.objectContaining({
          required: false,
          minimum: 0,
          maximum: 1_000_000_000,
        }),
      }),
    );
    expect(properties.comparison?.properties).toEqual(
      expect.objectContaining({
        previousHourRatio: expect.objectContaining({
          minimum: 0,
          maximum: 1_000,
        }),
        sevenDaySameHourRatio: expect.objectContaining({
          minimum: 0,
          maximum: 1_000,
        }),
      }),
    );

    for (const [name, maximum] of Object.entries(distributionMaximums)) {
      const distribution = properties[name]!;
      expect(distribution.maxItems).toBe(maximum);
      expect(Object.keys(distribution.items?.properties ?? {}).sort()).toEqual([
        "count",
        "id",
      ]);
      expect(distribution.items?.properties?.count).toMatchObject({
        minimum: 0,
        maximum: 1_000_000_000,
      });
    }

    expect(properties.targetDistribution?.items?.properties?.id?.enum).toEqual(
      FEEDBACK_SURFACE_IDS,
    );
    expect(
      properties.issueTypeDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_PERSISTABLE_ISSUE_TYPES);
    expect(
      properties.rendererDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_RENDERER_BUCKETS);
    expect(
      properties.backendDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_BACKEND_BUCKETS);
    expect(
      properties.viewportDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_VIEWPORT_BUCKETS);
    expect(
      properties.frameRateDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_FRAME_RATE_BUCKETS);
    expect(
      properties.frameTimeDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_FRAME_TIME_BUCKETS);
    expect(
      properties.diagnosticFeatureDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_GAME_FEATURE_IDS);
    expect(
      properties.diagnosticCounterDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_GAME_COUNTER_CODES);
    expect(
      properties.diagnosticErrorDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_GAME_ERROR_CODES);
    expect(properties.abuseBlockBands?.items?.properties?.id?.enum).toEqual(
      canonicalStringEnum(
        canonicalHourlyBugReport._shape.abuseBlockBands?.itemType?._shape?.id,
      ),
    );

    const advisories = properties.advisories!;
    expect(advisories.maxItems).toBe(32);
    expect(advisories.items?.properties?.code?.enum).toEqual(
      canonicalStringEnum(canonicalAdvisoryFields?.code),
    );
    expect(advisories.items?.properties?.level?.enum).toEqual(
      canonicalStringEnum(canonicalAdvisoryFields?.level),
    );
    expect(
      advisories.items?.properties?.recommendationIds?.items?.enum,
    ).toEqual(
      canonicalStringEnum(canonicalAdvisoryFields?.recommendationIds?.itemType),
    );
  });

  it("matches the canonical daily satisfaction aggregate including zero-data optionals", () => {
    const action = buildMcpSchemaResponse().actions.getFeedbackSatisfaction!;
    const report = action.output.reports!.items!;
    const properties = objectProperties(report);
    const distributionMaximums = {
      starDistribution: 5,
      sentimentDistribution: 7,
      intentDistribution: 12,
    };

    expect(action.schemaSource?.schemaNames).toEqual([
      "FeedbackDailySatisfactionReportSchema",
    ]);
    expect(partitionFieldKeys(properties)).toEqual(
      partitionCanonicalSchema(canonicalDailySatisfactionReport),
    );
    expect(properties.type?.constValue).toBe(
      canonicalDailySatisfactionReport.meta.entityType,
    );
    expect(properties.meanStars).toMatchObject({
      required: false,
      minimum: 1,
      maximum: 5,
    });
    expect(properties.meanStars?.description).toContain(
      "acceptedReviewCount` is zero",
    );
    expect(properties.medianStars).toMatchObject({
      required: false,
      minimum: 1,
      maximum: 5,
    });
    expect(properties.previousPeriodDeltaStars).toMatchObject({
      required: false,
      minimum: -4,
      maximum: 4,
    });
    expect(properties.processorLagSeconds).toMatchObject({
      minimum: 0,
      maximum: 1_000_000_000,
    });

    for (const [name, maximum] of Object.entries(distributionMaximums)) {
      expect(properties[name]?.maxItems).toBe(maximum);
    }
    expect(
      properties.sentimentDistribution?.items?.properties?.id?.enum,
    ).toEqual(FEEDBACK_SENTIMENT_BUCKETS);
    expect(properties.intentDistribution?.items?.properties?.id?.enum).toEqual(
      FEEDBACK_INTENT_IDS,
    );
    expect(properties.rollingWindows).toMatchObject({
      minItems: 3,
      maxItems: 3,
    });
    expect(properties.rollingWindows?.items?.properties?.period?.enum).toEqual(
      canonicalStringEnum(
        canonicalDailySatisfactionReport._shape.rollingWindows?.itemType?._shape
          ?.period,
      ),
    );
    expect(properties.rollingWindows?.items?.properties?.meanStars).toMatchObject(
      {
        required: false,
        minimum: 1,
        maximum: 5,
      },
    );
    expect(properties.advisories?.items?.properties?.code?.enum).toEqual(
      canonicalStringEnum(
        canonicalDailySatisfactionReport._shape.advisories?.itemType?._shape
          ?.code,
      ),
    );
  });

  it("uses canonical processor checkpoint vocabulary for freshness", () => {
    const action = buildMcpSchemaResponse().actions.getFeedbackFreshness!;
    const canonicalProcessors = canonicalStringEnum(
      canonicalProcessorCheckpoint._shape.processor,
    );
    expect(action.input.processor?.enum).toEqual(canonicalProcessors);
    const checkpoint =
      action.output.processors?.items?.properties?.checkpoint;
    expect(checkpoint?.discriminator).toBe("processor");
    expect(checkpoint?.oneOf).toHaveLength(3);

    for (const processor of canonicalProcessors) {
      const properties = objectProperties(
        unionVariant(checkpoint!, processor),
      );
      expect(properties.processor?.constValue).toBe(processor);
      expect(properties.type?.constValue).toBe(
        "feedback-processor-checkpoint",
      );
      expect(properties.version?.constValue).toBe(
        canonicalProcessorCheckpoint.meta.version,
      );
      if (processor === "commit-reconciliation") {
        expect(properties).not.toHaveProperty("reportId");
      } else {
        expect(properties.reportId?.pattern).toBe(
          CANONICAL_FEEDBACK_UUID_V4_PATTERN,
        );
      }
    }
  });

  it("makes every feedback privacy exclusion explicit without exposing forbidden fields", () => {
    const schema = buildMcpSchemaResponse();
    const feedbackActions = Object.values(schema.actions).filter(
      (action) => action.domain === "feedback",
    );
    const forbiddenOutputKeys = [
      "accountId",
      "userId",
      "reporterId",
      "pseudonym",
      "narrative",
      "quote",
      "summary",
      "embedding",
      "hash",
      "matchedValue",
      "modelTrace",
      "binaryImage",
      "screenshot",
      "blobReference",
      "blobUri",
      "url",
      "referrer",
      "ip",
      "userAgent",
      "session",
      "locale",
      "clientTimestamp",
      "coordinates",
      "adapterFingerprint",
    ];

    expect(feedbackActions).toHaveLength(MCP_ADMIN_FEEDBACK_ACTIONS.length);
    for (const action of feedbackActions) {
      expect(action.privacy?.excludes).toEqual(
        MCP_ADMIN_FEEDBACK_PRIVACY_EXCLUSIONS,
      );
      const outputKeys = collectFieldKeys(action.output);
      for (const forbiddenKey of forbiddenOutputKeys) {
        expect(outputKeys).not.toContain(forbiddenKey);
      }
    }

    expect(
      MCP_ADMIN_FEEDBACK_PRIVACY_EXCLUSIONS,
    ).toEqual([
      "account-identifiers",
      "reporter-pseudonyms",
      "network-identifiers",
      "session-identifiers",
      "user-agents",
      "locales",
      "client-timestamps",
      "referrers",
      "credential-material",
      "financial-identifiers",
      "government-identifiers",
      "narrative",
      "generated-summaries",
      "quotations",
      "embeddings",
      "content-hashes",
      "matched-values",
      "model-traces",
      "binary-images",
      "filenames",
      "exact-coordinates",
      "exact-dimensions",
      "adapter-fingerprints",
      "raw-warnings",
      "blob-references",
      "raw-urls",
      "unrestricted-scans",
      "mutations",
    ]);
  });

  it("closes every feedback object projection against undeclared fields", () => {
    for (const action of MCP_ADMIN_FEEDBACK_ACTIONS) {
      const objectFields = [
        ...Object.values(action.input).flatMap(collectObjectFields),
        ...Object.values(action.output).flatMap(collectObjectFields),
      ];

      expect(objectFields.length).toBeGreaterThan(0);
      for (const field of objectFields) {
        expect(field.additionalProperties).toBe(false);
      }
    }
  });

  it("uses closed windows and bounded cursors instead of unrestricted feedback scans", () => {
    const schema = buildMcpSchemaResponse();

    for (const action of MCP_ADMIN_FEEDBACK_ACTIONS) {
      const publicAction = schema.actions[action.name]!;
      expect(publicAction.execution.method).toBe("GET");
      expect(publicAction.input).not.toHaveProperty("from");
      expect(publicAction.input).not.toHaveProperty("to");
      expect(publicAction.input).not.toHaveProperty("query");
      expect(publicAction.input).not.toHaveProperty("url");

      if (publicAction.input.window) {
        expect(publicAction.input.window.enum?.length).toBeGreaterThan(0);
        expect(
          publicAction.input.window.enum?.every((window) =>
            [
              "previous-utc-hour",
              "last-24-hours",
              "last-7-days",
              "last-30-days",
              "last-90-days",
            ].includes(window),
          ),
        ).toBe(true);
      }

      if (publicAction.input.limit) {
        expect(publicAction.input.limit.minimum).toBe(1);
        expect(publicAction.input.limit.maximum).toBe(
          MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE,
        );
      }

      if (publicAction.input.cursor) {
        expect(publicAction.input.cursor.maxLength).toBe(
          MCP_ADMIN_FEEDBACK_MAX_CURSOR_LENGTH,
        );
      }

      if (publicAction.input.filters?.oneOf) {
        for (const variant of publicAction.input.filters.oneOf) {
          const variantFields = objectProperties(variant);
          expect(variantFields).not.toHaveProperty("from");
          expect(variantFields).not.toHaveProperty("to");
          expect(variantFields).not.toHaveProperty("query");
          expect(variantFields).not.toHaveProperty("url");
          expect(variantFields.window?.enum?.length).toBeGreaterThan(0);
          expect(variantFields.limit?.maximum).toBe(
            MCP_ADMIN_FEEDBACK_MAX_PAGE_SIZE,
          );
          expect(variantFields.cursor?.maxLength).toBe(
            MCP_ADMIN_FEEDBACK_MAX_CURSOR_LENGTH,
          );
        }
      }
    }
  });

  it("allows MCP description defaults to resolve through @plasius/translations", () => {
    const i18n = createI18n({
      language: "en-GB",
      fallback: "en-GB",
      translations: mcpAdminContractsTranslations,
    });

    expect(
      i18n.t(mcpAdminContractDescriptionKeys.actionUpdateFeatureFlag),
    ).toBe(
      "Patch an existing feature flag without bypassing the current admin update semantics.",
    );
    expect(
      i18n.t(mcpAdminContractDescriptionKeys.verificationAssignCapability),
    ).toBe(
      "Use admin audit history to verify the stored rule written by the capability assignment.",
    );
    expect(
      getMcpAdminContractDefaultTranslation(
        "mcpAdminContracts.missing.description" as Parameters<
          typeof getMcpAdminContractDefaultTranslation
        >[0],
      ),
    ).toBe("mcpAdminContracts.missing.description");
  });

  it("builds context responses from caller-supplied safe context only", () => {
    const context = buildMcpContextResponse({
      origin: "https://plasius.co.uk/some/path?query=1",
      authenticatedUser: {
        id: "admin-42",
        name: "Admin Forty Two",
        email: "admin42@example.com",
        provider: "google",
        groups: ["service-admin", "operators"],
      },
      rollout: {
        foundationFlagId: MCP_ADMIN_FOUNDATION_FLAG_ID,
        foundationEnabled: true,
        foundationSource: "feature-flag",
        envOverride: MCP_ADMIN_FOUNDATION_ENV_VAR,
      },
    });

    expect(context.surface.origin).toBe("https://plasius.co.uk");
    expect(context.surface.contextUrl).toBe("https://plasius.co.uk/api/mcp/context");
    expect(context.authenticatedUser.id).toBe("admin-42");
    expect(context.rollout.foundationEnabled).toBe(true);
    expect(context.actionFamilies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          domain: "productionReadiness",
          actions: [],
        }),
        expect.objectContaining({
          domain: "assetCatalog",
          rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
          actions: ["searchAssetCatalog", "getAssetManifest", "requestAsset"],
        }),
        expect.objectContaining({
          domain: "assetSource",
          rolloutFlag: MCP_ASSET_EXTERNAL_HARVEST_FLAG_ID,
          actions: ["searchAssetSources", "stageAssetSource"],
        }),
        expect.objectContaining({
          domain: "economyAdjustments",
          rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
          actions: [
            "getUserTokenWallet",
            "listUserTokenActivity",
            "listTokenAdjustments",
            "proposeTokenCredit",
            "approveTokenCredit",
            "rejectTokenCredit",
            "reverseTokenCredit",
          ],
        }),
        expect.objectContaining({
          domain: "economy",
          rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
          actions: [
            "get_admin_token_economy_overview",
            "list_admin_token_wallet_balances",
            "list_admin_token_activity",
            "get_admin_token_trends",
          ],
        }),
        expect.objectContaining({
          domain: "feedback",
          rolloutFlag: MCP_ADMIN_FEEDBACK_FLAG_ID,
          requiredCapability: MCP_ADMIN_FEEDBACK_READ_CAPABILITY,
          oauthScopes: MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES,
          actions: [
            "getFeedbackBugHealth",
            "getFeedbackSatisfaction",
            "listFeedbackAlerts",
            "getFeedbackFreshness",
            "listFeedbackStructuredEntries",
          ],
        }),
      ]),
    );
  });

  it("fails safe when optional authenticated context fields are absent or blank", () => {
    const base = {
      origin: "https://plasius.co.uk",
      rollout: {
        foundationFlagId: MCP_ADMIN_FOUNDATION_FLAG_ID,
        foundationEnabled: false,
        foundationSource: "feature-flag",
        envOverride: MCP_ADMIN_FOUNDATION_ENV_VAR,
      },
    };

    expect(buildMcpContextResponse(base).authenticatedUser).toEqual({
      id: "unknown-admin",
      name: "Unknown Admin",
      email: undefined,
      provider: "unknown",
      groups: [],
    });
    expect(
      buildMcpContextResponse({
        ...base,
        authenticatedUser: {
          id: " ",
          name: "\t",
          email: "\n",
          provider: "",
        },
      }).authenticatedUser,
    ).toEqual({
      id: "unknown-admin",
      name: "Unknown Admin",
      email: undefined,
      provider: "unknown",
      groups: [],
    });
  });

  it("keeps global plugin scopes staged until the site OAuth issuer is coordinated", () => {
    const manifest = buildAiPluginManifest("https://plasius.co.uk/api/mcp/context");

    expect(manifest).toMatchObject({
      schema_version: "1.0.0",
      name_for_model: "plasius_admin_control_plane",
      description_for_model:
        mcpAdminContractsEnGbTranslations[
          mcpAdminContractDescriptionKeys.manifestDescriptionForModel
        ],
      description:
        mcpAdminContractsEnGbTranslations[
          mcpAdminContractDescriptionKeys.manifestDescription
        ],
      context_url: "https://plasius.co.uk/api/mcp/context",
      actions_url: "https://plasius.co.uk/api/mcp/actions",
      schema_url: "https://plasius.co.uk/api/mcp/schema",
      auth: {
        type: "oauth",
        client_url: "https://plasius.co.uk/api/login",
        scope: "openid email profile mcp:access",
      },
    });
    expect(manifest.auth.scope.split(/\s+/)).not.toContain(
      MCP_ADMIN_FEEDBACK_READ_OAUTH_SCOPE,
    );
    expect(manifest.auth.scope.split(/\s+/)).toContain(
      MCP_ADMIN_BASE_OAUTH_SCOPE,
    );
  });

  it("keeps source code free of private runtime dependencies", () => {
    const source = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");

    expect(source).not.toMatch(/@azure\/functions/);
    expect(source).not.toMatch(/process\.env/);
    expect(source).not.toMatch(/getTableEntity/);
    expect(source).not.toMatch(/writeAdminAuditEvent/);
  });
});
