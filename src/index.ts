export const MCP_ADMIN_CONTRACT_VERSION = "2026-04-09.v1";
export const MCP_ADMIN_REGISTRY_SOURCE = "@plasius/mcp-admin-contracts";

export const MCP_ADMIN_FOUNDATION_FLAG_ID = "mcp.admin.foundation.enabled";
export const MCP_ADMIN_FOUNDATION_ENV_VAR = "MCP_ADMIN_FOUNDATION_ENABLED";
export const MCP_ADMIN_FOUNDATION_DISABLED_CODE = "MCP_ADMIN_FOUNDATION_DISABLED";

export const MCP_ADMIN_LIVEOPS_FLAG_ID = "mcp.admin.liveops-controls.enabled";
export const MCP_ADMIN_ANALYTICS_FLAG_ID = "mcp.admin.analytics.enabled";
export const MCP_ADMIN_PRODUCTION_READINESS_FLAG_ID =
  "mcp.admin.production-readiness.enabled";
export const MCP_ADMIN_PRODUCTION_READINESS_ENV_VAR =
  "MCP_ADMIN_PRODUCTION_READINESS_ENABLED";

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
  properties?: Record<string, McpFieldShape>;
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
}

export type McpActionDomain =
  | "featureFlags"
  | "capabilities"
  | "analytics"
  | "userAggregation";

export type McpActionFamilyDomain = McpActionDomain | "productionReadiness";

export interface McpActionDescriptor {
  name: string;
  description: string;
  domain: McpActionDomain;
  rolloutFlag: string;
  availability: "existing" | "near-future";
  execution: McpActionExecution;
  input: Record<string, McpFieldShape>;
  output: Record<string, McpFieldShape>;
  verification?: McpActionVerification;
}

export interface McpActionSummary {
  name: string;
  description: string;
  domain: McpActionDomain;
  rolloutFlag: string;
  availability: McpActionDescriptor["availability"];
  execution: McpActionExecution;
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

export const MCP_ADMIN_ACTIONS: readonly McpActionDescriptor[] = [
  {
    name: "listFeatureFlags",
    description: "List existing feature flags from the admin rollout control plane.",
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/feature-flags",
      source: "existing-route",
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
    description: "Fetch one feature flag by stable key.",
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/feature-flags/{key}",
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
    description: "Patch an existing feature flag without bypassing the current admin update semantics.",
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "PATCH",
      path: "/api/ops/feature-flags/{key}",
      source: "existing-route",
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
    description: "Explicitly enable a feature flag through the existing update path.",
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "PATCH",
      path: "/api/ops/feature-flags/{key}",
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
      description: "Use admin audit history to verify the rollout change.",
    },
  },
  {
    name: "disableFeatureFlag",
    description: "Explicitly disable a feature flag through the existing update path.",
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "PATCH",
      path: "/api/ops/feature-flags/{key}",
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
      description: "Use admin audit history to verify the rollout change.",
    },
  },
  {
    name: "getFeatureFlagHistory",
    description: "Read feature-flag history through the canonical admin audit query path.",
    domain: "featureFlags",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/audit/events",
      source: "existing-route",
    },
    input: {
      flagKey: stringField("Stable feature flag key.", { required: true }),
      days: numberField("Lookback window in days.", { required: false }),
      limit: numberField("Maximum events to return.", { required: false }),
    },
    output: {
      items: arrayField("Audit events related to the target feature flag.", "AdminAuditEvent"),
    },
  },
  {
    name: "listCapabilities",
    description: "List capability rules for a service using the existing capability-rule model.",
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/capability-rules",
      source: "existing-route",
    },
    input: {
      service: stringField("Service key to filter the rule list.", { required: false }),
    },
    output: {
      items: arrayField("Capability rule descriptors for the requested service.", "CapabilityRule"),
    },
  },
  {
    name: "getCapability",
    description: "Resolve one effective capability through the user-scoped capability read path.",
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
        capability: stringField("Capability identifier."),
        enabled: booleanField("Whether the capability is enabled."),
        payload: objectField("Optional capability payload.", {}, { required: false }),
        window: objectField("Optional active window.", {
          startsAt: stringField("Inclusive ISO-8601 start timestamp.", { required: false }),
          endsAt: stringField("Exclusive ISO-8601 end timestamp.", { required: false }),
        }, { required: false }),
      }),
    },
  },
  {
    name: "assignCapability",
    description: "Create or upsert a capability rule without introducing a second capability store.",
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/ops/capability-rules",
      source: "existing-route",
    },
    input: {
      service: stringField("Service key for the capability assignment.", { required: true }),
      capability: stringField("Capability identifier.", { required: true }),
      scope: stringField("Rule scope (`global`, `role`, `group`, or `user`).", {
        required: true,
        enum: ["global", "role", "group", "user"],
      }),
      subject: stringField("Rule subject when the scope is not global.", { required: false }),
      enabled: booleanField("Whether the rule enables the capability.", { required: true }),
      payload: objectField("Optional payload returned in capability discovery.", {}, {
        required: false,
      }),
      window: objectField("Optional time window for the rule.", {
        startsAt: stringField("Inclusive ISO-8601 start timestamp.", { required: false }),
        endsAt: stringField("Exclusive ISO-8601 end timestamp.", { required: false }),
      }, { required: false }),
    },
    output: {
      item: objectField("Stored capability rule.", {
        id: stringField("Capability rule identifier."),
        service: stringField("Service key."),
        capability: stringField("Capability identifier."),
        scope: stringField("Rule scope."),
        subject: stringField("Rule subject."),
      }),
    },
  },
  {
    name: "unassignCapability",
    description: "Delete one capability rule through the current destructive confirmation flow.",
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "DELETE",
      path: "/api/ops/capability-rules/{id}",
      source: "existing-route",
    },
    input: {
      ruleId: stringField("Capability rule identifier.", { required: true }),
      destructiveConfirmationToken: stringField(
        "Confirmation token issued by `/api/ops/destructive-confirmations`.",
        { required: true },
      ),
    },
    output: {
      success: booleanField("Whether the delete request succeeded."),
    },
    verification: {
      method: "GET",
      path: "/api/ops/audit/events",
      query: ["family=admin.capability-rule.update", "targetId={ruleId}"],
      description: "Use admin audit history to verify capability-rule deletion.",
    },
  },
  {
    name: "updateCapability",
    description: "Update a capability rule through the same upsert contract used for assignments.",
    domain: "capabilities",
    rolloutFlag: MCP_ADMIN_LIVEOPS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "POST",
      path: "/api/ops/capability-rules",
      source: "existing-route",
    },
    input: {
      id: stringField("Existing capability rule identifier.", { required: true }),
      service: stringField("Service key.", { required: true }),
      capability: stringField("Capability identifier.", { required: true }),
      scope: stringField("Rule scope.", {
        required: true,
        enum: ["global", "role", "group", "user"],
      }),
      subject: stringField("Rule subject when the scope is not global.", { required: false }),
      enabled: booleanField("Whether the rule enables the capability.", { required: true }),
      payload: objectField("Optional payload returned in capability discovery.", {}, {
        required: false,
      }),
    },
    output: {
      item: objectField("Updated capability rule.", {
        id: stringField("Capability rule identifier."),
        service: stringField("Service key."),
        capability: stringField("Capability identifier."),
      }),
    },
  },
  {
    name: "listAnalyticsMetrics",
    description: "List the approved analytics metrics from the curated MCP whitelist.",
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
      notes: [
        "The metric list is generated from the approved registry whitelist and maps onto `/api/ops/analytics/report` for execution.",
      ],
    },
    input: {},
    output: {
      items: arrayField("Approved analytics metric names.", "string"),
    },
  },
  {
    name: "listAnalyticsDimensions",
    description: "List the approved analytics dimensions from the curated MCP whitelist.",
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
    },
    input: {},
    output: {
      items: arrayField("Approved analytics dimension names.", "string"),
    },
  },
  {
    name: "runAnalyticsQuery",
    description: "Run a bounded analytics query using the existing operational analytics report API.",
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/analytics/report",
      source: "existing-route",
    },
    input: {
      metric: stringField("Approved analytics metric.", { required: true }),
      dimension: stringField("Approved analytics dimension.", { required: false }),
      lookbackHours: numberField("Lookback window in hours.", { required: false }),
      bucketMinutes: numberField("Bucket size in minutes.", { required: false }),
      topN: numberField("Maximum ranked rows to return.", { required: false }),
    },
    output: {
      summary: objectField("Aggregate analytics summary.", {
        totalEvents: numberField("Total events included in the report.", { required: false }),
      }),
      buckets: arrayField("Bucketed analytics rows.", "AnalyticsBucket"),
    },
  },
  {
    name: "runAnalyticsPreset",
    description: "Run a curated analytics preset instead of free-form BI-style queries.",
    domain: "analytics",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "existing",
    execution: {
      method: "GET",
      path: "/api/ops/analytics/report",
      source: "existing-route",
      notes: [
        "Preset names are curated in the registry; no unrestricted raw-query surface is exposed.",
      ],
    },
    input: {
      preset: stringField("Approved preset identifier.", {
        required: true,
        enum: ["adminOverview", "notificationsHealth", "recentErrors"],
      }),
      lookbackHours: numberField("Optional preset-specific lookback window.", {
        required: false,
      }),
    },
    output: {
      summary: objectField("Aggregate analytics summary.", {
        totalEvents: numberField("Total events included in the report.", { required: false }),
      }),
      buckets: arrayField("Bucketed analytics rows.", "AnalyticsBucket"),
    },
  },
  {
    name: "listAggregationMetrics",
    description: "List the approved user-aggregation metrics from the MCP whitelist.",
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "near-future",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
      notes: [
        "The whitelist is registry-generated while the execution route lands in the follow-on aggregation feature.",
      ],
    },
    input: {},
    output: {
      items: arrayField("Approved user-aggregation metric names.", "string"),
    },
  },
  {
    name: "listAggregationDimensions",
    description: "List the approved user-aggregation dimensions from the MCP whitelist.",
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "near-future",
    execution: {
      method: "GET",
      path: "/api/mcp/schema",
      source: "registry-generated",
    },
    input: {},
    output: {
      items: arrayField("Approved user-aggregation dimension names.", "string"),
    },
  },
  {
    name: "aggregateUsers",
    description: "Run grouped user aggregation over the bounded admin user data surface.",
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "near-future",
    execution: {
      method: "GET",
      path: "/api/users/admin/aggregation",
      source: "near-future-route",
    },
    input: {
      metric: stringField("Approved aggregation metric.", { required: true }),
      dimension: stringField("Approved aggregation dimension.", { required: true }),
      limit: numberField("Maximum grouped rows to return.", { required: false }),
    },
    output: {
      items: arrayField("Grouped summary rows only; raw user export remains out of scope.", "AggregationBucket"),
    },
  },
  {
    name: "aggregateUsersByPreset",
    description: "Run a curated user-aggregation preset against the bounded aggregation route.",
    domain: "userAggregation",
    rolloutFlag: MCP_ADMIN_ANALYTICS_FLAG_ID,
    availability: "near-future",
    execution: {
      method: "GET",
      path: "/api/users/admin/aggregation",
      source: "near-future-route",
    },
    input: {
      preset: stringField("Approved aggregation preset identifier.", {
        required: true,
        enum: ["usersByRole", "usersByProvider", "usersByAdminPersona"],
      }),
      limit: numberField("Maximum grouped rows to return.", { required: false }),
    },
    output: {
      items: arrayField("Grouped summary rows only; raw user export remains out of scope.", "AggregationBucket"),
    },
  },
] as const;

export function listMcpActionSummaries(): McpActionSummary[] {
  return MCP_ADMIN_ACTIONS.map((action) => ({
    name: action.name,
    description: action.description,
    domain: action.domain,
    rolloutFlag: action.rolloutFlag,
    availability: action.availability,
    execution: action.execution,
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
    envOverride: stringField("Break-glass env override name for local or emergency use."),
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

  return {
    schema_version: "1.0.0",
    name: "Plasius Admin MCP Discovery",
    name_for_model: "plasius_admin_control_plane",
    name_for_human: "Plasius Admin MCP",
    description_for_model:
      "OAuth-protected MCP discovery manifest for the Plasius admin control plane covering feature flags, capabilities, analytics, and audit-backed operations.",
    description:
      "Authenticated admin MCP discovery for the Plasius feature flag, capability, analytics, and audit control plane.",
    context_url: urls.contextUrl,
    actions_url: urls.actionsUrl,
    schema_url: urls.schemaUrl,
    auth: {
      type: "oauth",
      client_url: `${urls.apiBaseUrl}/login`,
      authorization_url: `${urls.apiBaseUrl}/oauth/authorize`,
      token_url: `${urls.apiBaseUrl}/oauth/token`,
      scope: "openid email profile",
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
