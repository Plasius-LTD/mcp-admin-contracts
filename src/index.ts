import {
  getMcpAdminContractDefaultTranslation,
  mcpAdminContractDescriptionKeys,
  mcpAdminContractsEnGbTranslations,
  mcpAdminContractsTranslations,
} from "./i18n.js";
import type { McpAdminContractDescriptionKey } from "./i18n.js";

export {
  getMcpAdminContractDefaultTranslation,
  mcpAdminContractDescriptionKeys,
  mcpAdminContractsEnGbTranslations,
  mcpAdminContractsTranslations,
};
export type { McpAdminContractDescriptionKey };

export const MCP_ADMIN_CONTRACT_VERSION = "2026-04-28.v4";
export const MCP_ADMIN_REGISTRY_SOURCE = "@plasius/mcp-admin-contracts";

export const MCP_ADMIN_FOUNDATION_FLAG_ID = "mcp.admin.foundation.enabled";
export const MCP_ACCESS_SCOPE = "mcp:access";
/**
 * @deprecated Runtime rollout decisions must come from stored feature flags.
 * This env name is retained only for source compatibility with older hosts.
 */
export const MCP_ADMIN_FOUNDATION_ENV_VAR = "MCP_ADMIN_FOUNDATION_ENABLED";
export const MCP_ADMIN_FOUNDATION_DISABLED_CODE = "MCP_ADMIN_FOUNDATION_DISABLED";

export const MCP_ADMIN_LIVEOPS_FLAG_ID = "mcp.admin.liveops-controls.enabled";
export const MCP_ADMIN_ANALYTICS_FLAG_ID = "mcp.admin.analytics.enabled";
export const ECONOMY_ADMIN_HISTORY_FLAG_ID = "economy.admin-history.enabled";
export const MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID =
  "mcp.admin-economy-history.enabled";
export const MCP_ADMIN_ECONOMY_READ_CAPABILITY = "admin.economy.read";
export const ECONOMY_FINANCE_OPERATIONS_VIEW_CAPABILITY =
  "economy.finance-operations.view";
export const MCP_ADMIN_PRODUCTION_READINESS_FLAG_ID =
  "mcp.admin.production-readiness.enabled";
/**
 * @deprecated Runtime rollout decisions must come from stored feature flags.
 * This env name is retained only for source compatibility with older hosts.
 */
export const MCP_ADMIN_PRODUCTION_READINESS_ENV_VAR =
  "MCP_ADMIN_PRODUCTION_READINESS_ENABLED";
export const MCP_ASSET_PIPELINE_FLAG_ID =
  "asset.pipeline.unified-ai-assets.enabled";
export const MCP_ASSET_EXTERNAL_HARVEST_FLAG_ID =
  "asset.pipeline.external-model-harvest.enabled";
export const MCP_ASSET_CATALOG_REQUEST_CAPABILITY = "asset.catalog.request";
export const MCP_ASSET_PIPELINE_MANAGE_CAPABILITY =
  "asset.pipeline.mcp.manage";
export const MCP_ASSET_SOURCE_MANAGE_CAPABILITY = "asset.source.manage";
export const MCP_ASSET_CATALOG_REVIEW_CAPABILITY = "asset.catalog.review";
export const MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID =
  "mcp.admin-economy-adjustments.enabled";
export const ECONOMY_OWNER_ADJUSTMENTS_FLAG_ID =
  "economy.tokens.owner-adjustments.enabled";
export const MCP_ECONOMY_FINANCE_VIEW_CAPABILITY =
  "economy.finance-operations.view";
export const MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY =
  "economy.finance-operations.adjust";
export const MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY =
  "economy.finance-operations.approve-adjustment";

export interface AiPluginManifest {
  schema_version: "1.0.0";
  name: string;
  name_for_model: string;
  name_for_human: string;
  description_for_model: string;
  description: string;
  context_url: string;
  actions_url: string;
  schema_url: string;
  auth: {
    type: "oauth";
    client_url: string;
    authorization_url: string;
    token_url: string;
    scope: string;
    authorization_content_type: "application/x-www-form-urlencoded";
    instructions: string;
  };
}

export interface McpFieldShape {
  type: string;
  description: string;
  required?: boolean;
  enum?: readonly string[];
  itemType?: string;
  items?: McpFieldShape;
  properties?: Record<string, McpFieldShape>;
  format?: string;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
  default?: string | number | boolean;
}

export interface McpActionExecution {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  source: "existing-route" | "near-future-route" | "registry-generated";
  notes?: string[];
}

export interface McpActionVerification {
  method: "GET";
  path: string;
  query: string[];
  description: string;
  descriptionKey: McpAdminContractDescriptionKey;
  descriptionDefault: string;
}

export type McpActionDomain =
  | "featureFlags"
  | "capabilities"
  | "analytics"
  | "userAggregation"
  | "economy"
  | "assetCatalog"
  | "assetPipeline"
  | "assetSource"
  | "assetReview"
  | "economyAdjustments";

export type McpActionFamilyDomain = McpActionDomain | "productionReadiness";

export interface McpActionAccessRequirements {
  /** OAuth scopes re-checked by the consuming runtime. */
  oauthScopes: readonly string[];
  /** Product capabilities re-resolved for the mapped MCP identity. */
  capabilities: readonly string[];
  /** Stored rollout flags that must all be enabled by the host. */
  rolloutFlags: readonly string[];
  mode: "read-only" | "mutation";
  identityResolution: "not-available" | "separate-governed-operation";
}

export interface McpActionDescriptor {
  name: string;
  description: string;
  descriptionKey: McpAdminContractDescriptionKey;
  descriptionDefault: string;
  domain: McpActionDomain;
  rolloutFlag: string;
  availability: "existing" | "near-future";
  execution: McpActionExecution;
  input: Record<string, McpFieldShape>;
  output: Record<string, McpFieldShape>;
  requiredCapability?: string;
  requiredTokenScopes?: readonly string[];
  access?: McpActionAccessRequirements;
  verification?: McpActionVerification;
}

export interface McpActionSummary {
  name: string;
  description: string;
  descriptionKey: McpAdminContractDescriptionKey;
  descriptionDefault: string;
  domain: McpActionDomain;
  rolloutFlag: string;
  availability: McpActionDescriptor["availability"];
  execution: McpActionExecution;
  requiredCapability?: string;
  requiredTokenScopes?: readonly string[];
  access?: McpActionAccessRequirements;
}

export interface McpDiscoveryResponse {
  contractVersion: string;
  sourceOfTruth: string;
  actions: McpActionSummary[];
}

export interface McpAuthenticatedUserContext {
  id: string;
  name: string;
  email?: string;
  provider: string;
  groups: string[];
}

export interface McpRolloutContext {
  foundationFlagId: string;
  foundationEnabled: boolean;
  foundationSource: string;
  /**
   * @deprecated Legacy compatibility field. Hosts must not use this as a
   * runtime rollout source of truth.
   */
  envOverride: string;
}

export interface McpSurfaceUrls {
  origin: string;
  apiBaseUrl: string;
  manifestUrl: string;
  actionsUrl: string;
  schemaUrl: string;
  contextUrl: string;
}

export interface McpContextResponse {
  contractVersion: string;
  authenticatedUser: McpAuthenticatedUserContext;
  surface: McpSurfaceUrls;
  rollout: McpRolloutContext;
  actionFamilies: {
    domain: McpActionFamilyDomain;
    rolloutFlag: string;
    actions: string[];
  }[];
  extensionRules: {
    sourceOfTruth: string;
    addOnlyWithinV1: boolean;
    discoveryBeforeMutation: boolean;
    singleResourceMutations: boolean;
    notes: string[];
  };
}

export interface McpSchemaResponse {
  contractVersion: string;
  sourceOfTruth: string;
  actions: Record<
    string,
    {
      domain: McpActionDomain;
      rolloutFlag: string;
      availability: McpActionDescriptor["availability"];
      execution: McpActionExecution;
      input: Record<string, McpFieldShape>;
      output: Record<string, McpFieldShape>;
      requiredCapability?: string;
      requiredTokenScopes?: readonly string[];
      access?: McpActionAccessRequirements;
      verification?: McpActionVerification;
    }
  >;
  contextShape: Record<string, McpFieldShape>;
  extensionRules: McpContextResponse["extensionRules"];
}

export interface BuildMcpContextResponseOptions {
  origin: string;
  authenticatedUser?: Partial<McpAuthenticatedUserContext>;
  rollout: McpRolloutContext;
}

const stringField = (
  description: string,
  options: Partial<McpFieldShape> = {},
): McpFieldShape => ({
  type: "string",
  description,
  ...options,
});

const booleanField = (
  description: string,
  options: Partial<McpFieldShape> = {},
): McpFieldShape => ({
  type: "boolean",
  description,
  ...options,
});

const numberField = (
  description: string,
  options: Partial<McpFieldShape> = {},
): McpFieldShape => ({
  type: "number",
  description,
  ...options,
});

const objectField = (
  description: string,
  properties: Record<string, McpFieldShape>,
  options: Partial<McpFieldShape> = {},
): McpFieldShape => ({
  type: "object",
  description,
  properties,
  ...options,
});

const arrayField = (
  description: string,
  itemType: string,
  options: Partial<McpFieldShape> = {},
): McpFieldShape => ({
  type: "array",
  description,
  itemType,
  ...options,
});

const translatedDescription = (
  descriptionKey: McpAdminContractDescriptionKey,
): {
  description: string;
  descriptionKey: McpAdminContractDescriptionKey;
  descriptionDefault: string;
} => {
  const descriptionDefault =
    getMcpAdminContractDefaultTranslation(descriptionKey);

  return {
    description: descriptionDefault,
    descriptionKey,
    descriptionDefault,
  };
};

export const MCP_ADMIN_ANALYTICS_METRICS = [
  "totalEvents",
  "errorEvents",
  "fatalEvents",
  "uniqueIdentities",
  "uniqueIpHashes",
  "thresholdTriggerCount",
] as const;

export const MCP_ADMIN_ANALYTICS_DIMENSIONS = [
  "timeline",
  "source",
  "component",
  "action",
  "errorFingerprint",
] as const;

export const MCP_ADMIN_ANALYTICS_PRESETS = [
  "adminOverview",
  "recentErrors",
  "notificationsHealth",
] as const;

export const MCP_ADMIN_USER_AGGREGATION_METRICS = ["userCount"] as const;
export const MCP_ADMIN_USER_AGGREGATION_DIMENSIONS = [
  "accountState",
  "notificationPreference",
  "avatarState",
  "accountAgeBand",
] as const;
export const MCP_ADMIN_USER_AGGREGATION_PRESETS = [
  "usersByAccountState",
  "usersByNotificationPreference",
  "usersByAccountAgeBand",
] as const;

export const MCP_ADMIN_TOKEN_ACTIVITY_TYPES = [
  "acquisition",
  "spend",
  "reversal",
  "hold",
  "failure",
] as const;

export const MCP_ADMIN_TOKEN_ACTIVITY_STATUSES = [
  "pending",
  "held",
  "settled",
  "reversed",
  "failed",
] as const;

/** Provider-neutral source groupings; provider names are intentionally absent. */
export const MCP_ADMIN_TOKEN_ACTIVITY_SOURCES = [
  "paid-purchase",
  "subscription",
  "rewarded-activity",
  "gameplay",
  "system-adjustment",
  "unknown",
] as const;

export const MCP_ADMIN_TOKEN_ACTIVITY_SORTS = [
  "occurred-at-desc",
  "amount-absolute-desc",
] as const;

export const MCP_ASSET_SOURCE_ADAPTERS = [
  "polyhaven",
  "kenney",
  "smithsonian-open-access",
  "nasa",
] as const;

export const MCP_ASSET_SOURCE_TIERS = ["tier-0"] as const;

export const MCP_ASSET_PROCESSING_OPERATIONS = [
  "validate-source-metadata",
  "metadata-cleanup",
  "archive-inspection",
  "validate-source",
  "convert-to-gltf",
  "normalize-orientation",
  "normalize-units",
  "normalize-origin",
  "optimize-textures",
  "generate-lod0",
  "generate-lod1",
  "generate-lod2",
  "generate-lod3",
  "generate-collision-proxy",
  "package-runtime",
] as const;

export const MCP_ASSET_REVIEW_KINDS = [
  "hero",
  "front",
  "back",
  "left",
  "right",
  "top",
  "material-closeup",
  "wireframe-density",
  "normal-debug",
  "lod-comparison",
  "collision-proxy",
  "scale-reference",
] as const;

const MCP_ADMIN_ANALYTICS_QUERY_SUPPORT = [
  {
    metric: "totalEvents",
    dimensions: ["timeline", "source", "component", "action"],
    reportSections: ["summary", "timeline", "topSources", "topComponents", "topActions"],
  },
  {
    metric: "errorEvents",
    dimensions: ["timeline", "errorFingerprint"],
    reportSections: ["summary", "timeline", "topErrorFingerprints", "thresholdTriggers"],
  },
  {
    metric: "fatalEvents",
    dimensions: ["timeline", "errorFingerprint"],
    reportSections: ["summary", "timeline", "topErrorFingerprints", "thresholdTriggers"],
  },
  {
    metric: "uniqueIdentities",
    dimensions: ["timeline"],
    reportSections: ["summary", "timeline"],
  },
  {
    metric: "uniqueIpHashes",
    dimensions: ["timeline"],
    reportSections: ["summary", "timeline"],
  },
  {
    metric: "thresholdTriggerCount",
    dimensions: ["errorFingerprint"],
    reportSections: ["summary", "topErrorFingerprints", "thresholdTriggers"],
  },
] as const;

const MCP_ADMIN_ANALYTICS_PRESET_SUPPORT = [
  {
    preset: "adminOverview",
    routes: ["/api/ops/analytics/report"],
    responseSections: ["summary", "timeline", "topSources", "topComponents", "topActions"],
  },
  {
    preset: "recentErrors",
    routes: ["/api/ops/analytics/report"],
    responseSections: ["summary", "timeline", "topErrorFingerprints", "thresholdTriggers"],
  },
  {
    preset: "notificationsHealth",
    routes: ["/api/ops/analytics/alert-policies", "/api/ops/analytics/advisories"],
    responseSections: ["alertPolicies", "advisories"],
  },
] as const;

function formatInlineCodeList(values: readonly string[]): string {
  return values.map((value) => `\`${value}\``).join(", ");
}

function describeAnalyticsMatrixEntry(entry: {
  metric: string;
  dimensions: readonly string[];
  reportSections: readonly string[];
}): string {
  return `\`${entry.metric}\` supports ${formatInlineCodeList(entry.dimensions)} and maps onto ${formatInlineCodeList(entry.reportSections)}.`;
}

function describeAnalyticsPresetEntry(entry: {
  preset: string;
  routes: readonly string[];
  responseSections: readonly string[];
}): string {
  return `\`${entry.preset}\` fans out to ${formatInlineCodeList(entry.routes)} and returns ${formatInlineCodeList(entry.responseSections)}.`;
}

const CAPABILITY_SCOPE_ENUM = ["global", "role", "group", "user"] as const;

const capabilityPayloadField = (
  description: string,
  options: Partial<McpFieldShape> = {},
): McpFieldShape =>
  objectField(description, {
    kind: stringField("Payload kind (`flag`, `route`, `url`, or `config`).", {
      enum: ["flag", "route", "url", "config"],
    }),
    target: stringField("Optional route or https target carried by the payload.", {
      required: false,
    }),
    params: objectField("Optional payload params preserved verbatim from the rule model.", {}, {
      required: false,
    }),
    schemaVersion: numberField("Positive payload schema version."),
  }, options);

const capabilityWindowField = (
  description: string,
  options: Partial<McpFieldShape> = {},
): McpFieldShape =>
  objectField(description, {
    startsAt: stringField("Inclusive ISO-8601 start timestamp.", { required: false }),
    endsAt: stringField("Exclusive ISO-8601 end timestamp.", { required: false }),
  }, options);

const capabilitySourceField = (
  description: string,
  options: Partial<McpFieldShape> = {},
): McpFieldShape =>
  objectField(description, {
    ruleId: stringField("Resolved backend rule id when a stored rule supplied the capability.", {
      required: false,
    }),
    scope: stringField("Scope of the winning rule when present.", {
      required: false,
      enum: [...CAPABILITY_SCOPE_ENUM],
    }),
    subject: stringField("Rule subject of the winning rule when present.", {
      required: false,
    }),
  }, options);

const assetJobStatusField = (
  description = "Governed asset job status."
): McpFieldShape =>
  objectField(description, {
    jobId: stringField("Stable asset job identifier."),
    assetId: stringField("Canonical asset identifier.", { required: false }),
    state: stringField("Current governed pipeline state."),
    sourceAdapter: stringField("Pipeline source adapter for the job.", { required: false }),
    requiredCapability: stringField("Capability required to mutate this job.", { required: false }),
    auditTargetId: stringField("Audit target id for follow-up verification.", { required: false }),
  });

const assetCatalogResultField = (
  description = "Promoted asset catalog result."
): McpFieldShape =>
  objectField(description, {
    assetId: stringField("Promoted asset identifier."),
    version: stringField("Promoted immutable asset version."),
    displayName: stringField("Human-readable asset name."),
    runtimeManifestUri: stringField("Player-safe promoted runtime manifest URI."),
    attributionRequired: booleanField("Whether runtime attribution is required."),
    screenshotUri: stringField("Representative promoted screenshot URI.", { required: false }),
  });

const assetOperationAcceptedOutput = {
  accepted: booleanField("Whether the hosted backend accepted the governed operation."),
  job: assetJobStatusField("Governed asset job created or updated by the operation."),
  nextAction: stringField("Next expected lifecycle action.", { required: false }),
} satisfies Record<string, McpFieldShape>;

const tokenAdjustmentOutput = {
  adjustment: objectField("Audited Token adjustment state.", {
    adjustmentId: stringField("Stable adjustment identifier."),
    targetAccountId: stringField("Target account identifier."),
    targetWalletId: stringField("Server-resolved target wallet identifier."),
    targetWalletKind: stringField("Server-resolved target wallet kind.", {
      enum: ["personal"],
    }),
    amountTokenSubunits: stringField(
      "Exact positive base-10 TokenSubunit amount; 1 Token is 1,000 subunits.",
    ),
    status: stringField("Current immutable workflow status.", {
      enum: ["pending", "approved", "rejected", "executed", "failed", "expired"],
    }),
    previewHash: stringField("Canonical preview hash bound to the proposal."),
    proposalHash: stringField("Canonical proposal hash bound to decisions."),
    proposerAccountId: stringField("Stable proposing owner account identifier."),
    approverAccountId: stringField("Distinct approving owner account identifier.", {
      required: false,
    }),
    createdAt: stringField("ISO-8601 proposal timestamp."),
    expiresAt: stringField("ISO-8601 proposal expiry timestamp."),
    transactionId: stringField("Immutable ledger transaction identifier.", {
      required: false,
    }),
  }),
} satisfies Record<string, McpFieldShape>;

const adminEconomyReadAccess = {
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
} as const satisfies McpActionAccessRequirements;

const adminTokenReportingWindowInput = {
  lookbackDays: numberField(
    "Optional whole-day lookback ending now; defaults to 30, cannot exceed 365, and hourly trend calls are further limited to 31. Do not combine with explicit timestamps.",
    {
      required: false,
      minimum: 1,
      maximum: 365,
      default: 30,
    },
  ),
  fromInclusive: stringField(
    "Optional inclusive ISO-8601 UTC start; the normalized interactive window cannot exceed 365 days.",
    { required: false, format: "date-time" },
  ),
  toExclusive: stringField(
    "Optional exclusive ISO-8601 UTC end; defaults to the request time.",
    { required: false, format: "date-time" },
  ),
} satisfies Record<string, McpFieldShape>;

const adminTokenActivityEntryField = objectField(
  "One pseudonymous Token activity row with no raw financial or identity identifiers.",
  {
    schemaVersion: stringField("Economy reporting contract version.", {
      enum: ["1"],
    }),
    occurredAt: stringField("ISO-8601 UTC activity timestamp.", {
      format: "date-time",
    }),
    activityType: stringField("Normalized Token activity type.", {
      enum: MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
    }),
    status: stringField("Normalized activity status.", {
      enum: MCP_ADMIN_TOKEN_ACTIVITY_STATUSES,
    }),
    source: stringField(
      "Provider-neutral source grouping; provider names and identifiers are excluded.",
      { enum: MCP_ADMIN_TOKEN_ACTIVITY_SOURCES },
    ),
    amount: stringField(
      "Exact signed TokenSubunit amount as a canonical base-10 integer string.",
      { format: "int64-string" },
    ),
    safeLabel: stringField(
      "Bounded source-owned display label with no account, payment, or provider metadata.",
    ),
    rowAlias: stringField(
      "Versioned audience-separated opaque alias for this reporting row.",
      { format: "pseudonymous-alias" },
    ),
    subjectAlias: stringField(
      "Versioned audience-separated opaque alias for the activity subject.",
      { format: "pseudonymous-alias" },
    ),
  },
);

const adminTokenAnomalyField = objectField(
  "Explainable advisory indicator; it never triggers a financial mutation.",
  {
    method: stringField("Server-owned baseline method.", {
      enum: ["same-window-median-mad-v1"],
    }),
    status: stringField("Advisory irregularity classification.", {
      enum: ["normal", "irregular-spike"],
    }),
    baselineWindowCount: numberField(
      "Count of preceding same-window samples used by the baseline.",
      { minimum: 28, maximum: 28, default: 28 },
    ),
    medianAmount: stringField("Exact median signed TokenSubunit amount.", {
      format: "int64-string",
    }),
    medianAbsoluteDeviation: stringField(
      "Exact median absolute deviation in TokenSubunits.",
      { format: "int64-string" },
    ),
    minimumAbsoluteDelta: stringField(
      "Server-owned exact absolute minimum required before a spike is reported.",
      { format: "int64-string" },
    ),
    deviationFromMedian: stringField(
      "Exact signed TokenSubunit deviation from the baseline median.",
      { format: "int64-string" },
    ),
    madMultiplierMilli: numberField(
      "Fixed-point MAD multiplier where 1,000 represents one MAD.",
      { minimum: 1, maximum: 1_000_000 },
    ),
    explanationCode: stringField("Stable explanation code for operator review."),
  },
  { required: false },
);

const adminTokenTrendPointField = objectField(
  "One hourly or daily activity-type trend point.",
  {
    schemaVersion: stringField("Economy reporting contract version.", {
      enum: ["1"],
    }),
    bucketStart: stringField("Inclusive aligned bucket start.", {
      format: "date-time",
    }),
    bucketEnd: stringField("Exclusive aligned bucket end.", {
      format: "date-time",
    }),
    activityType: stringField("Normalized Token activity type.", {
      enum: MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
    }),
    aggregate: objectField(
      "Reported aggregate or a suppression marker. Suppressed points omit counts, amounts, and anomaly details.",
      {
        visibility: stringField("Privacy visibility state.", {
          enum: ["reported", "suppressed"],
        }),
        reason: stringField(
          "Present only when the cohort is suppressed.",
          {
            required: false,
            enum: ["cohort-below-minimum"],
          },
        ),
        distinctSubjects: numberField(
          "Distinct pseudonymous subjects; present only for cohorts of at least five.",
          { required: false, minimum: 5 },
        ),
        activityCount: numberField(
          "Activity row count; absent for suppressed cohorts.",
          { required: false, minimum: 5 },
        ),
        signedAmount: stringField(
          "Exact aggregate signed TokenSubunits; absent for suppressed cohorts.",
          { required: false, format: "int64-string" },
        ),
        threshold: numberField(
          "Fixed minimum cohort size; present on suppression markers.",
          {
            required: false,
            minimum: 5,
            maximum: 5,
            default: 5,
          },
        ),
      },
    ),
    anomaly: adminTokenAnomalyField,
  },
);
export const MCP_ADMIN_ACTIONS: readonly McpActionDescriptor[] = [
  {
    name: "listFeatureFlags",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionListFeatureFlags),
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/feature-flags",
      source: "existing-route",
      notes: [
        "Delegates to the shared admin feature-flag list adapter instead of exposing the raw persistence route directly.",
      ],
    },
    input: {
      continuationToken: stringField("Opaque page token returned by a prior list call.", {
        required: false,
      }),
    },
    output: {
      items: arrayField("Feature flag records returned by the admin route.", "FeatureFlag"),
    },
  },
  {
    name: "getFeatureFlag",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionGetFeatureFlag),
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/feature-flags/{key}",
      source: "existing-route",
    },
    input: {
      flagKey: stringField("Stable feature flag key.", { required: true }),
    },
    output: {
      item: objectField("Resolved feature flag record.", {
        id: stringField("Stable feature flag key."),
        description: stringField("Operator-facing summary.", { required: false }),
        defaultValue: stringField("Default decision when no targeting rule matches."),
        targetedValue: stringField("Decision for targeted actors or groups.", {
          required: false,
        }),
        rolloutPercentage: numberField("Optional percentage rollout for targeted audiences.", {
          required: false,
        }),
      }),
    },
  },
  {
    name: "updateFeatureFlag",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionUpdateFeatureFlag),
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "PATCH",
      path: "/api/mcp/feature-flags/{key}",
      source: "existing-route",
      notes: [
        "Only the allowlisted mutable fields are exposed through the MCP adapter.",
      ],
    },
    input: {
      flagKey: stringField("Stable feature flag key.", { required: true }),
      description: stringField("Updated operator-facing summary.", { required: false }),
      defaultValue: stringField("Updated default decision.", { required: false }),
      targetedValue: stringField("Updated targeted decision.", { required: false }),
      rolloutPercentage: numberField("Updated rollout percentage.", { required: false }),
    },
    output: {
      success: booleanField("Whether the update request succeeded."),
    },
  },
  {
    name: "enableFeatureFlag",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionEnableFeatureFlag),
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/feature-flags/{key}/enable",
      source: "existing-route",
      notes: [
        "Maps to the approved feature-flag PATCH semantics rather than a separate persistence model.",
      ],
    },
    input: {
      flagKey: stringField("Stable feature flag key.", { required: true }),
    },
    output: {
      success: booleanField("Whether the enable request succeeded."),
    },
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.feature-flag.update", "targetId={flagKey}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationEnableFeatureFlag,
      ),
    },
  },
  {
    name: "disableFeatureFlag",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionDisableFeatureFlag),
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/feature-flags/{key}/disable",
      source: "existing-route",
      notes: [
        "Maps to the approved feature-flag PATCH semantics rather than a separate persistence model.",
      ],
    },
    input: {
      flagKey: stringField("Stable feature flag key.", { required: true }),
    },
    output: {
      success: booleanField("Whether the disable request succeeded."),
    },
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.feature-flag.update", "targetId={flagKey}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationDisableFeatureFlag,
      ),
    },
  },
  {
    name: "getFeatureFlagHistory",
    ...translatedDescription(
      mcpAdminContractDescriptionKeys.actionGetFeatureFlagHistory,
    ),
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/feature-flags/{key}/history",
      source: "existing-route",
      notes: [
        "Delegates to the shared admin audit query path filtered to `admin.feature-flag.update` and the target feature flag.",
      ],
    },
    input: {
      flagKey: stringField("Stable feature flag key.", { required: true }),
      days: numberField("Lookback window in days.", { required: false }),
      limit: numberField("Maximum events to return.", { required: false }),
    },
    output: {
      items: arrayField("Audit events related to the target feature flag.", "AdminAuditEvent"),
      summary: objectField("Audit query summary for verification workflows.", {
        returnedCount: numberField("Number of matching events returned.", { required: false }),
        daysSearched: numberField("Lookback window searched in days.", { required: false }),
      }, { required: false }),
      filters: objectField("Canonical audit filters applied to the history lookup.", {
        days: numberField("Lookback window in days.", { required: false }),
        limit: numberField("Maximum events returned.", { required: false }),
        family: stringField("Audit family filter.", { required: false }),
        targetId: stringField("Feature flag target identifier.", { required: false }),
        targetType: stringField("Audit target type.", { required: false }),
      }, { required: false }),
    },
  },
  {
    name: "listCapabilities",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionListCapabilities),
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/capability-rules",
      source: "existing-route",
      notes: [
        "Each returned rule includes the canonical MCP `ruleKey` tuple plus the resolved backend `ruleId` used for deletes and audit verification.",
      ],
    },
    input: {
      service: stringField("Service key to filter the rule list.", { required: false }),
    },
    output: {
      items: arrayField(
        "Normalized capability rule descriptors keyed by `ruleKey` and `ruleId`, including service/capability/scope/subject plus payload/window metadata.",
        "CapabilityRule",
      ),
    },
  },
  {
    name: "getCapability",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionGetCapability),
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/users/me/capabilities/{service}",
      source: "existing-route",
    },
    input: {
      service: stringField("Service key for the capability read.", { required: true }),
      capability: stringField("Capability identifier to inspect.", { required: true }),
    },
    output: {
      item: objectField("Effective capability record for the authenticated user.", {
        capabilityKey: stringField(
          "Canonical MCP effective-capability identifier `service=<service>;capability=<capability>`.",
        ),
        service: stringField("Service key."),
        capability: stringField("Capability identifier."),
        enabled: booleanField("Whether the capability is enabled."),
        source: capabilitySourceField("Winning rule metadata when the capability came from a stored rule."),
        payload: capabilityPayloadField("Optional capability payload.", { required: false }),
        window: capabilityWindowField("Optional active window.", { required: false }),
        nextTransitionAt: stringField("Next scheduled transition derived from the active rule window.", {
          required: false,
        }),
        target: stringField("Optional target resolved from the effective capability payload.", {
          required: false,
        }),
        description: stringField("Optional operator-facing description for the effective capability.", {
          required: false,
        }),
        requiredResource: stringField("Optional resource required to exercise the capability.", {
          required: false,
        }),
        requiredScopes: arrayField("Optional scopes required to exercise the capability.", "string", {
          required: false,
        }),
      }),
    },
  },
  {
    name: "assignCapability",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionAssignCapability),
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/ops/capability-rules",
      source: "existing-route",
      notes: [
        "The canonical MCP identity is the `service/capability/scope/subject` tuple, even though the backend stores a generated `ruleId`.",
      ],
    },
    input: {
      service: stringField("Service key for the capability assignment.", { required: true }),
      capability: stringField("Capability identifier.", { required: true }),
      scope: stringField("Rule scope (`global`, `role`, `group`, or `user`).", {
        required: true,
        enum: [...CAPABILITY_SCOPE_ENUM],
      }),
      subject: stringField("Rule subject when the scope is not global.", { required: false }),
      enabled: booleanField("Whether the rule enables the capability.", { required: true }),
      payload: capabilityPayloadField("Optional payload returned in capability discovery.", {
        required: false,
      }),
      window: capabilityWindowField("Optional time window for the rule.", { required: false }),
      target: stringField("Optional route or https target mirrored outside the payload for compatibility.", {
        required: false,
      }),
      requiredResource: stringField("Optional resource required to exercise the capability.", {
        required: false,
      }),
      requiredScopes: arrayField("Optional scopes required to exercise the capability.", "string", {
        required: false,
      }),
      description: stringField("Optional operator-facing description for the stored rule.", {
        required: false,
      }),
    },
    output: {
      item: objectField("Stored capability rule.", {
        ruleId: stringField("Resolved backend capability rule identifier."),
        ruleKey: stringField(
          "Canonical MCP mutable-rule identifier `service=<service>;capability=<capability>;scope=<scope>;subject=<subject-or-*>`.",
        ),
        capabilityKey: stringField(
          "Canonical MCP effective-capability identifier `service=<service>;capability=<capability>`.",
        ),
        service: stringField("Service key."),
        capability: stringField("Capability identifier."),
        scope: stringField("Rule scope."),
        subject: stringField("Rule subject."),
        enabled: booleanField("Whether the stored rule enables the capability."),
        payload: capabilityPayloadField("Optional payload stored with the rule.", { required: false }),
        window: capabilityWindowField("Optional time window stored with the rule.", {
          required: false,
        }),
      }),
    },
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.capability-rule.update", "targetId={resolvedRuleId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationAssignCapability,
      ),
    },
  },
  {
    name: "unassignCapability",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionUnassignCapability),
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "DELETE",
      path: "/api/ops/capability-rules/{id}",
      source: "existing-route",
      notes: [
        "When only the canonical tuple is supplied, the adapter resolves the matching `ruleId` from `/api/ops/capability-rules` before issuing the delete.",
      ],
    },
    input: {
      service: stringField("Service key for the rule being removed.", { required: true }),
      capability: stringField("Capability identifier for the rule being removed.", {
        required: true,
      }),
      scope: stringField("Rule scope for the rule being removed.", {
        required: true,
        enum: [...CAPABILITY_SCOPE_ENUM],
      }),
      subject: stringField("Rule subject when the scope is not global.", { required: false }),
      ruleId: stringField("Optional previously discovered backend rule id for the target rule.", {
        required: false,
      }),
      destructiveConfirmationToken: stringField(
        "Confirmation token issued by `/api/ops/destructive-confirmations`.",
        { required: true },
      ),
    },
    output: {
      success: booleanField("Whether the delete request succeeded."),
      resolvedRuleId: stringField("Resolved backend rule id that was deleted.", { required: false }),
      ruleKey: stringField(
        "Canonical MCP mutable-rule identifier for the deleted rule.",
        { required: false },
      ),
    },
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.capability-rule.update", "targetId={resolvedRuleId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationUnassignCapability,
      ),
    },
  },
  {
    name: "updateCapability",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionUpdateCapability),
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/ops/capability-rules",
      source: "existing-route",
      notes: [
        "Updates keep the tuple `service/capability/scope/subject` as the canonical MCP identity and may include a discovered `ruleId` only as an optimization hint.",
      ],
    },
    input: {
      ruleId: stringField("Optional existing capability rule identifier discovered earlier.", {
        required: false,
      }),
      service: stringField("Service key.", { required: true }),
      capability: stringField("Capability identifier.", { required: true }),
      scope: stringField("Rule scope.", {
        required: true,
        enum: [...CAPABILITY_SCOPE_ENUM],
      }),
      subject: stringField("Rule subject when the scope is not global.", { required: false }),
      enabled: booleanField("Whether the rule enables the capability.", { required: true }),
      payload: capabilityPayloadField("Optional payload returned in capability discovery.", {
        required: false,
      }),
      window: capabilityWindowField("Optional time window for the rule.", { required: false }),
      target: stringField("Optional route or https target mirrored outside the payload for compatibility.", {
        required: false,
      }),
      requiredResource: stringField("Optional resource required to exercise the capability.", {
        required: false,
      }),
      requiredScopes: arrayField("Optional scopes required to exercise the capability.", "string", {
        required: false,
      }),
      description: stringField("Optional operator-facing description for the stored rule.", {
        required: false,
      }),
    },
    output: {
      item: objectField("Updated capability rule.", {
        ruleId: stringField("Resolved backend capability rule identifier."),
        ruleKey: stringField(
          "Canonical MCP mutable-rule identifier `service=<service>;capability=<capability>;scope=<scope>;subject=<subject-or-*>`.",
        ),
        capabilityKey: stringField(
          "Canonical MCP effective-capability identifier `service=<service>;capability=<capability>`.",
        ),
        service: stringField("Service key."),
        capability: stringField("Capability identifier."),
        scope: stringField("Rule scope."),
        subject: stringField("Rule subject."),
      }),
    },
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.capability-rule.update", "targetId={resolvedRuleId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationUpdateCapability,
      ),
    },
  },
  {
    name: "listAnalyticsMetrics",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionListAnalyticsMetrics),
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
      notes: [
        `The metric list is generated from the approved whitelist: ${formatInlineCodeList(MCP_ADMIN_ANALYTICS_METRICS)}.`,
        "Whitelisted metrics map onto the bounded analytics report surface instead of a raw query engine.",
      ],
    },
    input: {},
    output: {
      items: arrayField("Approved analytics metric names.", "string", {
        enum: MCP_ADMIN_ANALYTICS_METRICS,
      }),
    },
  },
  {
    name: "listAnalyticsDimensions",
    ...translatedDescription(
      mcpAdminContractDescriptionKeys.actionListAnalyticsDimensions,
    ),
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
      notes: [
        `The dimension list is generated from the approved whitelist: ${formatInlineCodeList(MCP_ADMIN_ANALYTICS_DIMENSIONS)}.`,
      ],
    },
    input: {},
    output: {
      items: arrayField("Approved analytics dimension names.", "string", {
        enum: MCP_ADMIN_ANALYTICS_DIMENSIONS,
      }),
    },
  },
  {
    name: "runAnalyticsQuery",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionRunAnalyticsQuery),
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/analytics/report",
      source: "existing-route",
      notes: [
        "The MCP contract exposes only the bounded analytics-report envelope; raw analytics-engine access, free-form query text, and direct blob-scan controls stay out of scope.",
        ...MCP_ADMIN_ANALYTICS_QUERY_SUPPORT.map(describeAnalyticsMatrixEntry),
        "The MCP query envelope exposes `lookbackHours`, `bucketMinutes`, `topN`, `thresholdCount`, and `thresholdWindowMinutes`; `maxBlobsScan` remains backend-controlled for load safety.",
      ],
    },
    input: {
      metric: stringField(
        "Approved analytics metric. Use `listAnalyticsMetrics` first and keep to the whitelisted report projections.",
        { required: true, enum: MCP_ADMIN_ANALYTICS_METRICS },
      ),
      dimension: stringField(
        "Optional approved analytics dimension. Supported combinations are documented in ADR 0056 and the MCP discovery API docs.",
        { required: false, enum: MCP_ADMIN_ANALYTICS_DIMENSIONS },
      ),
      lookbackHours: numberField(
        "Lookback window in hours, bounded by the admin analytics report maximum.",
        { required: false },
      ),
      bucketMinutes: numberField(
        "Bucket size in minutes for timeline projections, bounded by the admin analytics report maximum.",
        { required: false },
      ),
      topN: numberField("Maximum ranked rows to return.", { required: false }),
      thresholdCount: numberField(
        "Optional error-burst threshold count used for threshold-trigger analysis.",
        { required: false },
      ),
      thresholdWindowMinutes: numberField(
        "Optional threshold-trigger window in minutes. The adapter translates this to the backend `thresholdWindowMs` query parameter.",
        { required: false },
      ),
    },
    output: {
      summary: objectField("Aggregate analytics summary.", {
        generatedAt: stringField("UTC timestamp when the report was generated.", {
          required: false,
        }),
        windowStart: stringField("Inclusive UTC start of the analyzed window.", {
          required: false,
        }),
        windowEnd: stringField("Exclusive UTC end of the analyzed window.", {
          required: false,
        }),
        lookbackHours: numberField("Lookback window used by the backing report.", {
          required: false,
        }),
        bucketMinutes: numberField("Bucket size used by the backing report.", {
          required: false,
        }),
        totalEvents: numberField("Total events included in the report.", { required: false }),
        errorEvents: numberField("Error-level events included in the report.", {
          required: false,
        }),
        fatalEvents: numberField("Fatal events included in the report.", {
          required: false,
        }),
        uniqueIdentities: numberField("Unique identity hashes observed in the window.", {
          required: false,
        }),
        uniqueIpHashes: numberField("Unique IP hashes observed in the window.", {
          required: false,
        }),
      }),
      timeline: arrayField("Timeline buckets for `timeline` projections.", "AnalyticsTimelinePoint"),
      topSources: arrayField("Ranked source rows for `source` projections.", "AnalyticsRankedMetric"),
      topComponents: arrayField(
        "Ranked component rows for `component` projections.",
        "AnalyticsRankedMetric",
      ),
      topActions: arrayField("Ranked action rows for `action` projections.", "AnalyticsRankedMetric"),
      topErrorFingerprints: arrayField(
        "Ranked error-fingerprint rows for `errorFingerprint` projections.",
        "AnalyticsErrorFingerprint",
      ),
      thresholdTriggers: arrayField(
        "Threshold trigger rows derived from the existing analytics report.",
        "AnalyticsThresholdTrigger",
      ),
    },
  },
  {
    name: "runAnalyticsPreset",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionRunAnalyticsPreset),
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/analytics/report",
      source: "existing-route",
      notes: [
        "Preset names are curated in the registry; no unrestricted raw-query surface is exposed.",
        ...MCP_ADMIN_ANALYTICS_PRESET_SUPPORT.map(describeAnalyticsPresetEntry),
      ],
    },
    input: {
      preset: stringField("Approved preset identifier.", {
        required: true,
        enum: MCP_ADMIN_ANALYTICS_PRESETS,
      }),
      lookbackHours: numberField("Optional preset-specific lookback window.", {
        required: false,
      }),
      bucketMinutes: numberField("Optional preset-specific bucket size in minutes.", {
        required: false,
      }),
      topN: numberField("Optional preset-specific ranked row limit.", {
        required: false,
      }),
      thresholdCount: numberField(
        "Optional preset-specific error-burst threshold count.",
        { required: false },
      ),
      thresholdWindowMinutes: numberField(
        "Optional preset-specific threshold window in minutes.",
        { required: false },
      ),
    },
    output: {
      summary: objectField("Aggregate analytics summary.", {
        generatedAt: stringField("UTC timestamp when the report or preset payload was generated.", {
          required: false,
        }),
        totalEvents: numberField("Total events included in the report.", { required: false }),
        errorEvents: numberField("Error-level events included in the report.", {
          required: false,
        }),
        fatalEvents: numberField("Fatal events included in the report.", {
          required: false,
        }),
      }),
      timeline: arrayField("Timeline buckets included by the preset.", "AnalyticsTimelinePoint"),
      topSources: arrayField("Ranked source rows included by the preset.", "AnalyticsRankedMetric"),
      topComponents: arrayField(
        "Ranked component rows included by the preset.",
        "AnalyticsRankedMetric",
      ),
      topActions: arrayField("Ranked action rows included by the preset.", "AnalyticsRankedMetric"),
      topErrorFingerprints: arrayField(
        "Ranked error-fingerprint rows included by the preset.",
        "AnalyticsErrorFingerprint",
      ),
      thresholdTriggers: arrayField(
        "Threshold trigger rows included by the preset.",
        "AnalyticsThresholdTrigger",
      ),
      alertPolicies: arrayField(
        "Alert policy rows returned only by the `notificationsHealth` preset.",
        "AdminAlertPolicy",
      ),
      advisories: arrayField(
        "Advisory rows returned only by the `notificationsHealth` preset.",
        "AdminRemediationAdvisory",
      ),
    },
  },
  {
    name: "listAggregationMetrics",
    ...translatedDescription(
      mcpAdminContractDescriptionKeys.actionListAggregationMetrics,
    ),
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
    },
    input: {},
    output: {
      items: arrayField("Approved user-aggregation metric names.", "string", {
        enum: MCP_ADMIN_USER_AGGREGATION_METRICS,
      }),
    },
  },
  {
    name: "listAggregationDimensions",
    ...translatedDescription(
      mcpAdminContractDescriptionKeys.actionListAggregationDimensions,
    ),
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
    },
    input: {},
    output: {
      items: arrayField("Approved user-aggregation dimension names.", "string", {
        enum: MCP_ADMIN_USER_AGGREGATION_DIMENSIONS,
      }),
    },
  },
  {
    name: "aggregateUsers",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionAggregateUsers),
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/users/admin/aggregation",
      source: "existing-route",
      notes: [
        "Returns grouped summary buckets only, suppresses low-cardinality buckets, and never emits raw per-user export rows.",
      ],
    },
    input: {
      metric: stringField("Approved aggregation metric.", {
        required: true,
        enum: MCP_ADMIN_USER_AGGREGATION_METRICS,
      }),
      dimension: stringField("Approved aggregation dimension.", {
        required: true,
        enum: MCP_ADMIN_USER_AGGREGATION_DIMENSIONS,
      }),
      limit: numberField("Maximum grouped rows to return.", { required: false }),
    },
    output: {
      summary: objectField("Bounded grouped-summary metadata.", {
        generatedAt: stringField("UTC timestamp when the aggregation payload was generated."),
        metric: stringField("Approved aggregation metric.", {
          enum: MCP_ADMIN_USER_AGGREGATION_METRICS,
        }),
        dimension: stringField("Approved aggregation dimension.", {
          enum: MCP_ADMIN_USER_AGGREGATION_DIMENSIONS,
        }),
        usersScanned: numberField("How many user rows were scanned from the bounded admin data plane."),
        returnedBucketCount: numberField("How many grouped buckets were returned."),
        suppressedBucketCount: numberField("How many low-cardinality buckets were suppressed."),
        omittedBucketCount: numberField("How many additional safe buckets were omitted after the requested limit."),
        truncated: booleanField("Whether bounded scanning or response limits truncated the full grouped output."),
      }),
      items: arrayField(
        "Grouped summary rows only; raw user export remains out of scope.",
        "AggregationBucket",
      ),
    },
  },
  {
    name: "aggregateUsersByPreset",
    ...translatedDescription(
      mcpAdminContractDescriptionKeys.actionAggregateUsersByPreset,
    ),
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/users/admin/aggregation",
      source: "existing-route",
    },
    input: {
      preset: stringField("Approved aggregation preset identifier.", {
        required: true,
        enum: MCP_ADMIN_USER_AGGREGATION_PRESETS,
      }),
      limit: numberField("Maximum grouped rows to return.", { required: false }),
    },
    output: {
      summary: objectField("Bounded grouped-summary metadata.", {
        generatedAt: stringField("UTC timestamp when the aggregation payload was generated."),
        metric: stringField("Metric resolved by the approved preset.", {
          enum: MCP_ADMIN_USER_AGGREGATION_METRICS,
        }),
        dimension: stringField("Dimension resolved by the approved preset.", {
          enum: MCP_ADMIN_USER_AGGREGATION_DIMENSIONS,
        }),
        preset: stringField("Approved preset that drove the query.", {
          enum: MCP_ADMIN_USER_AGGREGATION_PRESETS,
        }),
        usersScanned: numberField("How many user rows were scanned from the bounded admin data plane."),
        returnedBucketCount: numberField("How many grouped buckets were returned."),
        suppressedBucketCount: numberField("How many low-cardinality buckets were suppressed."),
        omittedBucketCount: numberField("How many additional safe buckets were omitted after the requested limit."),
        truncated: booleanField("Whether bounded scanning or response limits truncated the full grouped output."),
      }),
      items: arrayField(
        "Grouped summary rows only; raw user export remains out of scope.",
        "AggregationBucket",
      ),
    },
  },
  {
    name: "list_admin_token_activity",
    ...translatedDescription(
      mcpAdminContractDescriptionKeys.actionListAdminTokenActivity,
    ),
    domain: "economy",
    rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
    availability: "near-future",
    access: adminEconomyReadAccess,
    execution: {
      method: "GET",
      path: "/api/mcp/economy/token-activity",
      source: "near-future-route",
      notes: [
        "The hosted site must register this descriptor as a JSON-RPC MCP tool; publishing this package does not create the runtime route.",
        "Responses are private/no-store, bounded to 100 rows, and contain only audience-separated pseudonyms plus source-owned labels.",
        "The tool is read-only and cannot resolve a pseudonym or mutate a financial record.",
      ],
    },
    input: {
      ...adminTokenReportingWindowInput,
      limit: numberField("Maximum activity rows to return.", {
        required: false,
        minimum: 1,
        maximum: 100,
        default: 100,
      }),
      cursor: stringField(
        "Opaque query-bound cursor returned by the preceding page.",
        { required: false, format: "opaque-cursor" },
      ),
      activityTypes: arrayField(
        "Optional allowlisted activity-type filters.",
        "string",
        {
          required: false,
          enum: MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
          maxItems: MCP_ADMIN_TOKEN_ACTIVITY_TYPES.length,
        },
      ),
      statuses: arrayField("Optional allowlisted activity-status filters.", "string", {
        required: false,
        enum: MCP_ADMIN_TOKEN_ACTIVITY_STATUSES,
        maxItems: MCP_ADMIN_TOKEN_ACTIVITY_STATUSES.length,
      }),
      sources: arrayField(
        "Optional provider-neutral source-group filters.",
        "string",
        {
          required: false,
          enum: MCP_ADMIN_TOKEN_ACTIVITY_SOURCES,
          maxItems: MCP_ADMIN_TOKEN_ACTIVITY_SOURCES.length,
        },
      ),
      subjectAlias: stringField(
        "Optional exact MCP-audience subject alias; raw account identifiers are not accepted.",
        { required: false, format: "pseudonymous-alias" },
      ),
      sort: stringField("Allowlisted stable sort.", {
        required: false,
        enum: MCP_ADMIN_TOKEN_ACTIVITY_SORTS,
        default: "occurred-at-desc",
      }),
    },
    output: {
      schemaVersion: stringField("Economy reporting contract version.", {
        enum: ["1"],
      }),
      items: arrayField(
        "Pseudonymous activity rows; no account, wallet, transaction, order, payment, provider-event, idempotency, or journal-integrity identifiers.",
        "AdminTokenActivityEntryV1",
        {
          items: adminTokenActivityEntryField,
          maxItems: 100,
        },
      ),
      hasMore: booleanField("Whether another bounded page exists."),
      nextCursor: stringField("Opaque cursor for the next page.", {
        required: false,
        format: "opaque-cursor",
      }),
      metadata: objectField("Privacy and normalized query metadata.", {
        schemaVersion: stringField("Economy reporting contract version.", {
          enum: ["1"],
        }),
        generatedAt: stringField("UTC time the result was generated.", {
          format: "date-time",
        }),
        fromInclusive: stringField("Normalized inclusive UTC window start.", {
          format: "date-time",
        }),
        toExclusive: stringField("Normalized exclusive UTC window end.", {
          format: "date-time",
        }),
        sort: stringField("Applied stable sort.", {
          enum: MCP_ADMIN_TOKEN_ACTIVITY_SORTS,
        }),
        pageLimit: numberField("Applied page bound.", {
          minimum: 1,
          maximum: 100,
        }),
        audience: stringField("Pseudonym audience fixed by the MCP endpoint.", {
          enum: ["mcp-token-activity"],
        }),
        pseudonymVersion: stringField("Active opaque pseudonym key version."),
        rawIdentifiersIncluded: booleanField(
          "Always false for this public-safe contract.",
          { default: false },
        ),
      }),
    },
  },
  {
    name: "get_admin_token_trends",
    ...translatedDescription(
      mcpAdminContractDescriptionKeys.actionGetAdminTokenTrends,
    ),
    domain: "economy",
    rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
    availability: "near-future",
    access: adminEconomyReadAccess,
    execution: {
      method: "GET",
      path: "/api/mcp/economy/token-trends",
      source: "near-future-route",
      notes: [
        "The hosted site must register this descriptor as a JSON-RPC MCP tool; publishing this package does not create the runtime route.",
        "Cohorts below five are suppression markers with no counts, amounts, aliases, or anomaly details.",
        "Anomalies are explainable review signals and never mutate financial records.",
      ],
    },
    input: {
      ...adminTokenReportingWindowInput,
      granularity: stringField("Hourly or daily UTC aggregation.", {
        required: false,
        enum: ["hour", "day"],
        default: "day",
      }),
      activityTypes: arrayField(
        "Optional allowlisted trend activity types.",
        "string",
        {
          required: false,
          enum: MCP_ADMIN_TOKEN_ACTIVITY_TYPES,
          maxItems: MCP_ADMIN_TOKEN_ACTIVITY_TYPES.length,
        },
      ),
    },
    output: {
      schemaVersion: stringField("Economy reporting contract version.", {
        enum: ["1"],
      }),
      series: arrayField(
        "Bounded, stably ordered trend points.",
        "AdminTokenTrendPointV1",
        {
          items: adminTokenTrendPointField,
          maxItems: 1_000,
        },
      ),
      metadata: objectField("Trend privacy and baseline metadata.", {
        schemaVersion: stringField("Economy reporting contract version.", {
          enum: ["1"],
        }),
        generatedAt: stringField("UTC time the result was generated.", {
          format: "date-time",
        }),
        fromInclusive: stringField("Normalized inclusive UTC window start.", {
          format: "date-time",
        }),
        toExclusive: stringField("Normalized exclusive UTC window end.", {
          format: "date-time",
        }),
        granularity: stringField("Applied UTC aggregation granularity.", {
          enum: ["hour", "day"],
        }),
        minimumCohortSize: numberField(
          "Fixed minimum distinct-subject cohort before aggregate disclosure.",
          { minimum: 5, maximum: 5, default: 5 },
        ),
        anomalyBaselineDays: numberField(
          "Fixed same-window median/MAD baseline length.",
          { minimum: 28, maximum: 28, default: 28 },
        ),
        rawIdentifiersIncluded: booleanField(
          "Always false for this public-safe contract.",
          { default: false },
        ),
      }),
    },
  },
  {
    name: "searchAssetCatalog",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionSearchAssetCatalog),
    domain: "assetCatalog",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/assets/catalog",
      source: "existing-route",
      notes: [
        "Searches only promoted catalog records and never performs live third-party lookup.",
        `Requires capability \`${MCP_ASSET_CATALOG_REQUEST_CAPABILITY}\`.`,
      ],
    },
    input: {
      query: stringField("Search text for promoted catalog records.", { required: true }),
      locale: stringField("Locale for search normalization.", { required: false }),
      limit: numberField("Maximum promoted catalog records to return.", { required: false }),
    },
    output: {
      items: arrayField("Promoted catalog results only.", "AssetCatalogResult"),
      capability: stringField(
        `Capability required to use this catalog read: \`${MCP_ASSET_CATALOG_REQUEST_CAPABILITY}\`.`,
      ),
    },
  },
  {
    name: "getAssetManifest",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionGetAssetManifest),
    domain: "assetCatalog",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/assets/catalog/{assetId}/manifest",
      source: "existing-route",
      notes: [
        "Returns promoted runtime manifest references only; raw source URLs remain private.",
      ],
    },
    input: {
      assetId: stringField("Promoted asset identifier.", { required: true }),
      version: stringField("Optional immutable version; defaults to the current promoted version.", {
        required: false,
      }),
    },
    output: {
      item: assetCatalogResultField("Promoted manifest lookup result."),
      capability: stringField(
        `Capability required to use this manifest read: \`${MCP_ASSET_CATALOG_REQUEST_CAPABILITY}\`.`,
      ),
    },
  },
  {
    name: "requestAsset",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionRequestAsset),
    domain: "assetCatalog",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/requests",
      source: "existing-route",
      notes: [
        "Queues a governed missing-asset request instead of resolving through live external source lookup.",
      ],
    },
    input: {
      requestedObjectText: stringField("Natural-language object request with no direct external URLs.", {
        required: true,
      }),
      locale: stringField("Requester locale.", { required: true }),
      requesterId: stringField("Requester or session identifier.", { required: true }),
      playerContext: stringField("Optional bounded player/context note.", { required: false }),
    },
    output: assetOperationAcceptedOutput,
  },
  {
    name: "searchAssetSources",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionSearchAssetSources),
    domain: "assetSource",
    rolloutFlag: MCP_ASSET_EXTERNAL_HARVEST_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/assets/sources",
      source: "existing-route",
      notes: [
        `Tier-0 source adapters only: ${formatInlineCodeList(MCP_ASSET_SOURCE_ADAPTERS)}.`,
        "Results expose source metadata and license status, not raw download URLs.",
      ],
    },
    input: {
      query: stringField("Search text for approved external source registries.", { required: true }),
      sourceId: stringField("Optional Tier-0 source adapter filter.", {
        required: false,
        enum: MCP_ASSET_SOURCE_ADAPTERS,
      }),
      limit: numberField("Maximum source candidates to return.", { required: false }),
    },
    output: {
      items: arrayField("Approved source candidates without raw download URLs.", "AssetSourceCandidate"),
      adapters: arrayField("Enabled Tier-0 source adapter identifiers.", "string", {
        enum: MCP_ASSET_SOURCE_ADAPTERS,
      }),
      capability: stringField(
        `Capability required to use source discovery: \`${MCP_ASSET_SOURCE_MANAGE_CAPABILITY}\`.`,
      ),
    },
  },
  {
    name: "stageAssetSource",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionStageAssetSource),
    domain: "assetSource",
    rolloutFlag: MCP_ASSET_EXTERNAL_HARVEST_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/sources/stage",
      source: "existing-route",
      notes: [
        "Stages one source candidate for governed license and metadata review before processing.",
      ],
    },
    input: {
      sourceId: stringField("Tier-0 source adapter identifier.", {
        required: true,
        enum: MCP_ASSET_SOURCE_ADAPTERS,
      }),
      sourceAssetId: stringField("Adapter-local source asset identifier.", { required: true }),
      requestedBy: stringField("Operator or service identity requesting staging.", { required: true }),
    },
    output: assetOperationAcceptedOutput,
  },
  {
    name: "createAssetJob",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionCreateAssetJob),
    domain: "assetPipeline",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/jobs",
      source: "existing-route",
      notes: [
        `Requires capability \`${MCP_ASSET_PIPELINE_MANAGE_CAPABILITY}\`.`,
      ],
    },
    input: {
      assetId: stringField("Canonical target asset identifier.", { required: true }),
      sourceAdapter: stringField("Pipeline source adapter.", {
        required: true,
        enum: ["local-import", "ai-generate", "ai-modify", "texture-regenerate", "processor-retry", "external-import"],
      }),
      requestedBy: stringField("Operator or service identity creating the job.", { required: true }),
    },
    output: assetOperationAcceptedOutput,
  },
  {
    name: "uploadAssetSource",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionUploadAssetSource),
    domain: "assetPipeline",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/jobs/{jobId}/sources",
      source: "existing-route",
    },
    input: {
      jobId: stringField("Asset job identifier.", { required: true }),
      sourceBlobUri: stringField("Private staged blob URI or approved blob reference.", { required: true }),
      sha256: stringField("Lowercase source artifact sha256 digest.", { required: false }),
      contentType: stringField("Source content type.", { required: false }),
    },
    output: assetOperationAcceptedOutput,
  },
  {
    name: "processAssetJob",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionProcessAssetJob),
    domain: "assetPipeline",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/jobs/{jobId}/process",
      source: "existing-route",
      notes: [
        `Allowed operation set: ${formatInlineCodeList(MCP_ASSET_PROCESSING_OPERATIONS)}.`,
      ],
    },
    input: {
      jobId: stringField("Asset job identifier.", { required: true }),
      operations: arrayField("Optional subset of approved processing operations.", "string", {
        required: false,
        enum: MCP_ASSET_PROCESSING_OPERATIONS,
      }),
      targetRuntime: stringField("Runtime target for packaged artifacts.", {
        required: false,
        enum: ["gpu-shared", "game-runtime"],
      }),
    },
    output: assetOperationAcceptedOutput,
  },
  {
    name: "renderAssetReview",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionRenderAssetReview),
    domain: "assetReview",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/jobs/{jobId}/review/render",
      source: "existing-route",
      notes: [
        `Review capture kinds are registry bounded: ${formatInlineCodeList(MCP_ASSET_REVIEW_KINDS)}.`,
      ],
    },
    input: {
      jobId: stringField("Asset job identifier.", { required: true }),
      captureKinds: arrayField("Optional review capture kinds to request.", "string", {
        required: false,
        enum: MCP_ASSET_REVIEW_KINDS,
      }),
    },
    output: assetOperationAcceptedOutput,
  },
  {
    name: "reviewAssetCandidate",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionReviewAssetCandidate),
    domain: "assetReview",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/jobs/{jobId}/review",
      source: "existing-route",
    },
    input: {
      jobId: stringField("Asset job identifier.", { required: true }),
      decision: stringField("Review decision.", {
        required: true,
        enum: ["approved", "rejected", "needs-changes"],
      }),
      summary: stringField("Human-readable review summary.", { required: true }),
    },
    output: assetOperationAcceptedOutput,
  },
  {
    name: "promoteAsset",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionPromoteAsset),
    domain: "assetReview",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/jobs/{jobId}/promote",
      source: "existing-route",
      notes: [
        "Promotion requires manifest, review report, screenshot evidence, approval, runtime manifest URI, and license eligibility.",
      ],
    },
    input: {
      jobId: stringField("Asset job identifier.", { required: true }),
      runtimeChannel: stringField("Runtime channel receiving the immutable manifest reference.", {
        required: true,
      }),
      approvedBy: stringField("Approver identity.", { required: true }),
    },
    output: assetOperationAcceptedOutput,
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.asset-promotion.update", "targetId={jobId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationPromoteAsset,
      ),
    },
  },
  {
    name: "rollbackAsset",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionRollbackAsset),
    domain: "assetReview",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/mcp/assets/{assetId}/rollback",
      source: "existing-route",
    },
    input: {
      assetId: stringField("Promoted asset identifier.", { required: true }),
      targetVersion: stringField("Previously promoted immutable version to restore.", {
        required: true,
      }),
      runtimeChannel: stringField("Runtime channel to roll back.", { required: true }),
      destructiveConfirmationToken: stringField("Destructive confirmation token for rollback.", {
        required: true,
      }),
    },
    output: assetOperationAcceptedOutput,
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.asset-promotion.update", "targetId={assetId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationRollbackAsset,
      ),
    },
  },
  {
    name: "getAssetJobStatus",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionGetAssetJobStatus),
    domain: "assetPipeline",
    rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/assets/jobs/{jobId}",
      source: "existing-route",
    },
    input: {
      jobId: stringField("Asset job identifier.", { required: true }),
    },
    output: {
      job: assetJobStatusField(),
      plannedOperations: arrayField("Processing or review operations planned for the job.", "string"),
      evidence: arrayField("Review and processing evidence references available to the caller.", "AssetEvidence"),
    },
  },
  {
    name: "getUserTokenWallet",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionGetUserTokenWallet),
    domain: "economyAdjustments",
    rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    availability: "near-future",
    requiredCapability: MCP_ECONOMY_FINANCE_VIEW_CAPABILITY,
    requiredTokenScopes: ["mcp:access", MCP_ECONOMY_FINANCE_VIEW_CAPABILITY],
    execution: {
      method: "GET",
      path: "/api/mcp/economy/users/{accountId}/wallet",
      source: "near-future-route",
      notes: [
        "The backend resolves the personal wallet from the account id; callers cannot select an arbitrary wallet.",
      ],
    },
    input: {
      accountId: stringField("Stable target account identifier.", { required: true }),
    },
    output: {
      wallet: objectField("Authorized Token wallet summary.", {
        accountId: stringField("Stable target account identifier."),
        initialized: booleanField(
          "Whether the authoritative personal wallet has been initialized.",
        ),
        walletId: stringField("Server-resolved wallet identifier.", {
          required: false,
        }),
        walletKind: stringField("Server-resolved wallet kind.", { enum: ["personal"] }),
        availableTokenSubunits: stringField("Exact available TokenSubunits as base-10 text."),
        heldTokenSubunits: stringField("Exact held TokenSubunits as base-10 text."),
        lifetimeCreditedTokenSubunits: stringField(
          "Exact lifetime credited TokenSubunits as base-10 text.",
        ),
        lifetimeReversedTokenSubunits: stringField(
          "Exact lifetime reversed TokenSubunits as base-10 text.",
        ),
        projectionVersion: stringField("Optimistic concurrency projection version.", {
          required: false,
        }),
      }),
    },
  },
  {
    name: "listUserTokenActivity",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionListUserTokenActivity),
    domain: "economyAdjustments",
    rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    availability: "near-future",
    requiredCapability: MCP_ECONOMY_FINANCE_VIEW_CAPABILITY,
    requiredTokenScopes: ["mcp:access", MCP_ECONOMY_FINANCE_VIEW_CAPABILITY],
    execution: {
      method: "GET",
      path: "/api/mcp/economy/users/{accountId}/activity",
      source: "near-future-route",
    },
    input: {
      accountId: stringField("Stable target account identifier.", { required: true }),
      cursor: stringField("Opaque continuation cursor.", { required: false }),
      limit: numberField("Maximum results; the backend applies a bounded ceiling.", {
        required: false,
      }),
    },
    output: {
      items: arrayField("Immutable Token activity entries.", "WalletActivityEntryV1"),
      nextCursor: stringField("Opaque cursor for the next page.", { required: false }),
    },
  },
  {
    name: "listTokenAdjustments",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionListTokenAdjustments),
    domain: "economyAdjustments",
    rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    availability: "near-future",
    requiredCapability: MCP_ECONOMY_FINANCE_VIEW_CAPABILITY,
    requiredTokenScopes: ["mcp:access", MCP_ECONOMY_FINANCE_VIEW_CAPABILITY],
    execution: {
      method: "GET",
      path: "/api/mcp/economy/adjustments",
      source: "near-future-route",
    },
    input: {
      targetAccountId: stringField("Optional target account filter.", { required: false }),
      status: stringField("Optional workflow status filter.", {
        required: false,
        enum: ["pending", "approved", "rejected", "executed", "failed", "expired"],
      }),
      cursor: stringField("Opaque continuation cursor.", { required: false }),
      limit: numberField("Maximum results; the backend applies a bounded ceiling.", {
        required: false,
      }),
    },
    output: {
      items: arrayField("Audited adjustment workflow records.", "OperatorAdjustmentProposalV1"),
      nextCursor: stringField("Opaque cursor for the next page.", { required: false }),
    },
  },
  {
    name: "proposeTokenCredit",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionProposeTokenCredit),
    domain: "economyAdjustments",
    rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    availability: "near-future",
    requiredCapability: MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY,
    requiredTokenScopes: ["mcp:access", MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY],
    execution: {
      method: "POST",
      path: "/api/mcp/economy/adjustments/token-credits",
      source: "near-future-route",
      notes: [
        "This creates a preview-bound proposal only; it does not credit the wallet until a distinct owner approves it.",
        "Raw idempotency keys and ticket references are fingerprinted before authoritative persistence.",
      ],
    },
    input: {
      targetAccountId: stringField("Stable target account identifier.", { required: true }),
      targetWalletKind: stringField("Permitted server-resolved wallet kind.", {
        required: true,
        enum: ["personal"],
      }),
      amountTokenSubunits: stringField(
        "Exact positive base-10 TokenSubunit amount; 1 Token is 1,000 subunits.",
        { required: true },
      ),
      reasonCode: stringField("Allowlisted operator reason code.", { required: true }),
      ticketReference: stringField("Support or change ticket reference.", { required: true }),
      idempotencyKey: stringField("Caller-generated idempotency key.", { required: true }),
    },
    output: tokenAdjustmentOutput,
    verification: {
      method: "GET",
      path: "/api/mcp/economy/adjustments",
      query: ["adjustmentId={adjustmentId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationTokenAdjustment,
      ),
    },
  },
  {
    name: "approveTokenCredit",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionApproveTokenCredit),
    domain: "economyAdjustments",
    rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    availability: "near-future",
    requiredCapability: MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY,
    requiredTokenScopes: [
      "mcp:access",
      MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY,
    ],
    execution: {
      method: "POST",
      path: "/api/mcp/economy/adjustments/{adjustmentId}/approve",
      source: "near-future-route",
      notes: [
        "The authenticated approver must be a different stable platform-owner account from the proposer.",
      ],
    },
    input: {
      adjustmentId: stringField("Stable pending adjustment identifier.", { required: true }),
      expectedPreviewHash: stringField("Preview hash displayed to the approver.", {
        required: true,
      }),
      expectedProposalHash: stringField("Proposal hash displayed to the approver.", {
        required: true,
      }),
      idempotencyKey: stringField("Caller-generated idempotency key.", { required: true }),
    },
    output: tokenAdjustmentOutput,
    verification: {
      method: "GET",
      path: "/api/mcp/economy/adjustments",
      query: ["adjustmentId={adjustmentId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationTokenAdjustment,
      ),
    },
  },
  {
    name: "rejectTokenCredit",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionRejectTokenCredit),
    domain: "economyAdjustments",
    rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    availability: "near-future",
    requiredCapability: MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY,
    requiredTokenScopes: [
      "mcp:access",
      MCP_ECONOMY_FINANCE_APPROVE_CAPABILITY,
    ],
    execution: {
      method: "POST",
      path: "/api/mcp/economy/adjustments/{adjustmentId}/reject",
      source: "near-future-route",
    },
    input: {
      adjustmentId: stringField("Stable pending adjustment identifier.", { required: true }),
      expectedPreviewHash: stringField("Preview hash displayed to the approver.", {
        required: true,
      }),
      expectedProposalHash: stringField("Proposal hash displayed to the approver.", {
        required: true,
      }),
      reasonCode: stringField("Allowlisted rejection reason code.", { required: true }),
      idempotencyKey: stringField("Caller-generated idempotency key.", { required: true }),
    },
    output: tokenAdjustmentOutput,
    verification: {
      method: "GET",
      path: "/api/mcp/economy/adjustments",
      query: ["adjustmentId={adjustmentId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationTokenAdjustment,
      ),
    },
  },
  {
    name: "reverseTokenCredit",
    ...translatedDescription(mcpAdminContractDescriptionKeys.actionReverseTokenCredit),
    domain: "economyAdjustments",
    rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
    availability: "near-future",
    requiredCapability: MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY,
    requiredTokenScopes: ["mcp:access", MCP_ECONOMY_FINANCE_ADJUST_CAPABILITY],
    execution: {
      method: "POST",
      path: "/api/mcp/economy/adjustments/{adjustmentId}/reverse",
      source: "near-future-route",
      notes: [
        "A reversal is a separately approved compensating transaction; the original credit is never updated or deleted.",
      ],
    },
    input: {
      originalAdjustmentId: stringField("Executed credit adjustment to reverse.", {
        required: true,
      }),
      reasonCode: stringField("Allowlisted reversal reason code.", { required: true }),
      ticketReference: stringField("Support or change ticket reference.", { required: true }),
      idempotencyKey: stringField("Caller-generated idempotency key.", { required: true }),
    },
    output: tokenAdjustmentOutput,
    verification: {
      method: "GET",
      path: "/api/mcp/economy/adjustments",
      query: ["adjustmentId={adjustmentId}"],
      ...translatedDescription(
        mcpAdminContractDescriptionKeys.verificationTokenAdjustment,
      ),
    },
  },
] as const;

export function listMcpActionSummaries(): McpActionSummary[] {
  return MCP_ADMIN_ACTIONS.map((action) => ({
    name: action.name,
    description: action.description,
    descriptionKey: action.descriptionKey,
    descriptionDefault: action.descriptionDefault,
    domain: action.domain,
    rolloutFlag: action.rolloutFlag,
    availability: action.availability,
    execution: action.execution,
    requiredCapability: action.requiredCapability,
    requiredTokenScopes: action.requiredTokenScopes,
    access: action.access,
  }));
}

export const MCP_ADMIN_CONTEXT_SHAPE: Record<string, McpFieldShape> = {
  contractVersion: stringField("Versioned discovery contract identifier."),
  authenticatedUser: objectField("Authenticated admin session context.", {
    id: stringField("Authenticated user identifier."),
    name: stringField("Authenticated user display name."),
    email: stringField("Authenticated user email.", { required: false }),
    provider: stringField("Identity provider for the authenticated session."),
    groups: arrayField("Resolved group memberships for the authenticated user.", "string"),
  }),
  surface: objectField("Discovery URLs and API base path.", {
    origin: stringField("Origin inferred from the incoming request URL."),
    apiBaseUrl: stringField("Base `/api` prefix for follow-on requests."),
    manifestUrl: stringField("AI plugin manifest URL."),
    actionsUrl: stringField("MCP discovery actions URL."),
    schemaUrl: stringField("MCP discovery schema URL."),
    contextUrl: stringField("MCP discovery context URL."),
  }),
  rollout: objectField("Rollout controls that protect the MCP discovery surface.", {
    foundationFlagId: stringField("Primary feature flag protecting the discovery surface."),
    foundationEnabled: booleanField("Whether the discovery surface is enabled for the current runtime."),
    foundationSource: stringField("How the foundation flag was resolved."),
    envOverride: stringField(
      "Deprecated legacy env override name retained for compatibility only; stored feature flags are the runtime rollout source of truth.",
    ),
  }),
  actionFamilies: arrayField("Approved action families grouped by rollout domain.", "McpActionFamily"),
  extensionRules: objectField("Rules for extending the registry without changing the discovery shape.", {
    sourceOfTruth: stringField("Package that owns the approved MCP registry."),
    addOnlyWithinV1: booleanField("Whether v1 additions must be additive."),
    discoveryBeforeMutation: booleanField("Whether agents must discover targets before mutation."),
    singleResourceMutations: booleanField("Whether mutations must target one resource at a time."),
    notes: arrayField("Extension notes for future MCP tool families.", "string"),
  }),
};

export const MCP_ADMIN_EXTENSION_RULES = {
  sourceOfTruth: MCP_ADMIN_REGISTRY_SOURCE,
  addOnlyWithinV1: true,
  discoveryBeforeMutation: true,
  singleResourceMutations: true,
  notes: [
    "Future game/admin asset actions must reuse the same descriptor shape instead of adding a second discovery contract.",
    "New descriptors must define rolloutFlag, execution mapping, input shape, output shape, and verification notes where applicable.",
    "Sensitive read descriptors must publish their OAuth scope, capability, rollout, read-only, and identity-resolution metadata without treating discovery as authorization.",
  ],
};

export function buildMcpSurfaceUrls(origin: string): McpSurfaceUrls {
  const normalizedOrigin = normalizeOrigin(origin);
  return {
    origin: normalizedOrigin,
    apiBaseUrl: `${normalizedOrigin}/api`,
    manifestUrl: `${normalizedOrigin}/api/.well-known/ai-plugin.json`,
    actionsUrl: `${normalizedOrigin}/api/mcp/actions`,
    schemaUrl: `${normalizedOrigin}/api/mcp/schema`,
    contextUrl: `${normalizedOrigin}/api/mcp/context`,
  };
}

export function buildAiPluginManifest(origin: string): AiPluginManifest {
  const urls = buildMcpSurfaceUrls(origin);
  const descriptionForModel = getMcpAdminContractDefaultTranslation(
    mcpAdminContractDescriptionKeys.manifestDescriptionForModel,
  );
  const description = getMcpAdminContractDefaultTranslation(
    mcpAdminContractDescriptionKeys.manifestDescription,
  );

  return {
    schema_version: "1.0.0",
    name: "Plasius Admin MCP Discovery",
    name_for_model: "plasius_admin_control_plane",
    name_for_human: "Plasius Admin MCP",
    description_for_model: descriptionForModel,
    description,
    context_url: urls.contextUrl,
    actions_url: urls.actionsUrl,
    schema_url: urls.schemaUrl,
    auth: {
      type: "oauth",
      client_url: `${urls.apiBaseUrl}/login`,
      authorization_url: `${urls.apiBaseUrl}/oauth/authorize`,
      token_url: `${urls.apiBaseUrl}/oauth/token`,
      scope: `openid email profile ${MCP_ACCESS_SCOPE}`,
      authorization_content_type: "application/x-www-form-urlencoded",
      instructions:
        "Sign in with an admin-capable Google or Microsoft account to access the Plasius MCP control plane.",
    },
  };
}

export function buildMcpDiscoveryResponse(): McpDiscoveryResponse {
  return {
    contractVersion: MCP_ADMIN_CONTRACT_VERSION,
    sourceOfTruth: MCP_ADMIN_REGISTRY_SOURCE,
    actions: listMcpActionSummaries(),
  };
}

export function buildMcpSchemaResponse(): McpSchemaResponse {
  const actions = Object.fromEntries(
    MCP_ADMIN_ACTIONS.map((action) => [
      action.name,
      {
        domain: action.domain,
        rolloutFlag: action.rolloutFlag,
        availability: action.availability,
        execution: action.execution,
        input: action.input,
        output: action.output,
        requiredCapability: action.requiredCapability,
        requiredTokenScopes: action.requiredTokenScopes,
        access: action.access,
        verification: action.verification,
      },
    ]),
  );

  return {
    contractVersion: MCP_ADMIN_CONTRACT_VERSION,
    sourceOfTruth: MCP_ADMIN_REGISTRY_SOURCE,
    actions,
    contextShape: MCP_ADMIN_CONTEXT_SHAPE,
    extensionRules: MCP_ADMIN_EXTENSION_RULES,
  };
}

export function buildMcpContextResponse(
  options: BuildMcpContextResponseOptions,
): McpContextResponse {
  return {
    contractVersion: MCP_ADMIN_CONTRACT_VERSION,
    authenticatedUser: normalizeAuthenticatedUser(options.authenticatedUser),
    surface: buildMcpSurfaceUrls(options.origin),
    rollout: options.rollout,
    actionFamilies: buildMcpActionFamilies(),
    extensionRules: MCP_ADMIN_EXTENSION_RULES,
  };
}

function buildMcpActionFamilies(): McpContextResponse["actionFamilies"] {
  return [
    {
      domain: "featureFlags",
      rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
      actions: getActionsByDomain("featureFlags"),
    },
    {
      domain: "capabilities",
      rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
      actions: getActionsByDomain("capabilities"),
    },
    {
      domain: "analytics",
      rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
      actions: getActionsByDomain("analytics"),
    },
    {
      domain: "userAggregation",
      rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
      actions: getActionsByDomain("userAggregation"),
    },
    {
      domain: "economy",
      rolloutFlag: MCP_ADMIN_ECONOMY_HISTORY_FLAG_ID,
      actions: getActionsByDomain("economy"),
    },
    {
      domain: "assetCatalog",
      rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
      actions: getActionsByDomain("assetCatalog"),
    },
    {
      domain: "assetSource",
      rolloutFlag: MCP_ASSET_EXTERNAL_HARVEST_FLAG_ID,
      actions: getActionsByDomain("assetSource"),
    },
    {
      domain: "assetPipeline",
      rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
      actions: getActionsByDomain("assetPipeline"),
    },
    {
      domain: "assetReview",
      rolloutFlag: MCP_ASSET_PIPELINE_FLAG_ID,
      actions: getActionsByDomain("assetReview"),
    },
    {
      domain: "economyAdjustments",
      rolloutFlag: MCP_ADMIN_ECONOMY_ADJUSTMENTS_FLAG_ID,
      actions: getActionsByDomain("economyAdjustments"),
    },
    {
      domain: "productionReadiness",
      rolloutFlag: MCP_ADMIN_PRODUCTION_READINESS_FLAG_ID,
      actions: [],
    },
  ];
}

function getActionsByDomain(domain: McpActionDomain): string[] {
  return MCP_ADMIN_ACTIONS
    .filter((action) => action.domain === domain)
    .map((action) => action.name);
}

function normalizeAuthenticatedUser(
  user: Partial<McpAuthenticatedUserContext> | undefined,
): McpAuthenticatedUserContext {
  return {
    id: normalizeNonEmptyString(user?.id) ?? "unknown-admin",
    name: normalizeNonEmptyString(user?.name) ?? "Unknown Admin",
    email: normalizeOptionalString(user?.email),
    provider: normalizeNonEmptyString(user?.provider) ?? "unknown",
    groups: Array.isArray(user?.groups)
      ? user.groups.filter((group): group is string => typeof group === "string")
      : [],
  };
}

function normalizeOrigin(origin: string): string {
  const parsed = new URL(origin);
  return parsed.origin;
}

function normalizeNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return normalizeNonEmptyString(value);
}
