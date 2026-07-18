import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createI18n } from "@plasius/translations";
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
  MCP_ADMIN_CONTRACT_VERSION,
  MCP_ACCESS_SCOPE,
  MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
  ECONOMY_ADMIN_HISTORY_FLAG_ID,
  MCP_ADMIN_ECONOMY_READ_CAPABILITY,
  ECONOMY_FINANCE_OPERATIONS_VIEW_CAPABILITY,
  MCP_ADMIN_TOKEN_ACTIVITY_SOURCES,
  MCP_ADMIN_TOKEN_ACTIVITY_STATUSES,
  MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
  MCP_ADMIN_FOUNDATION_ENV_VAR,
  MCP_ADMIN_FOUNDATION_FLAG_ID,
  MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
  MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY,
  MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY,
  MCP_ECONOMY_FINANCE_VIEW_CAPABILITY,
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
} from "../src/index.js";

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
      "list_admin_token_activity",
    );
    expect(response.actions.map((action) => action.name)).toContain(
      "get_admin_token_trends",
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
    const getUserTokenWallet = schema.actions.getUserTokenWallet!;
    const proposeTokenCredit = schema.actions.proposeTokenCredit!;
    const approveTokenCredit = schema.actions.approveTokenCredit!;
    const reverseTokenCredit = schema.actions.reverseTokenCredit!;

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
    expect(getUserTokenWallet.domain).toBe("economyAdjustments");
    expect(getUserTokenWallet.rolloutFlag).toBe(
      MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    );
    expect(getUserTokenWallet.requiredCapability).toBe(
      MCP_ECONOMY_FINANCE_VIEW_CAPABILITY,
    );
    expect(getUserTokenWallet.requiredTokenScopes).toEqual([
      "mcp:access",
      MCP_ECONOMY_FINANCE_VIEW_CAPABILITY,
    ]);
    expect(getUserTokenWallet.output.wallet!.properties?.initialized?.type).toBe(
      "boolean",
    );
    expect(getUserTokenWallet.output.wallet!.properties?.walletId?.required).toBe(
      false,
    );
    expect(proposeTokenCredit.requiredCapability).toBe(
      MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY,
    );
    expect(proposeTokenCredit.input.amountTokenSubunits!.type).toBe("string");
    expect(proposeTokenCredit.input.amountTokenSubunits!.required).toBe(true);
    expect(proposeTokenCredit.input.targetWalletKind!.enum).toEqual(["personal"]);
    expect(approveTokenCredit.requiredCapability).toBe(
      MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY,
    );
    expect(approveTokenCredit.input.expectedPreviewHash!.required).toBe(true);
    expect(reverseTokenCredit.input.originalAdjustmentId!.required).toBe(true);
    expect(reverseTokenCredit.execution.method).toBe("POST");
    expect(
      Object.values(schema.actions).some(
        (action) => action.execution.method === "DELETE" && action.domain === "economyAdjustments",
      ),
    ).toBe(false);
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
            "list_admin_token_activity",
            "get_admin_token_trends",
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

  it("builds the approved plugin manifest from the request origin", () => {
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
        scope: expect.stringContaining(MCP_ACCESS_SCOPE),
      },
    });
  });

  it("keeps source code free of private runtime dependencies", () => {
    const source = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");

    expect(source).not.toMatch(/@azure\/functions/);
    expect(source).not.toMatch(/process\.env/);
    expect(source).not.toMatch(/getTableEntity/);
    expect(source).not.toMatch(/writeAdminAuditEvent/);
  });
});
