import type { McpAdminContractDescriptionKey } from "../i18n.js";

export const mcpAdminContractsEnGbTranslations = {
  "mcpAdminContracts.manifest.descriptionForModel":
    "OAuth-protected MCP discovery manifest for the Plasius admin control plane covering feature flags, capabilities, analytics, and audit-backed operations.",
  "mcpAdminContracts.manifest.description":
    "Authenticated admin MCP discovery for the Plasius feature flag, capability, analytics, and audit control plane.",
  "mcpAdminContracts.action.listFeatureFlags.description":
    "List existing feature flags from the admin rollout control plane.",
  "mcpAdminContracts.action.getFeatureFlag.description":
    "Fetch one feature flag by stable key.",
  "mcpAdminContracts.action.updateFeatureFlag.description":
    "Patch an existing feature flag without bypassing the current admin update semantics.",
  "mcpAdminContracts.action.enableFeatureFlag.description":
    "Explicitly enable a feature flag through the existing update path.",
  "mcpAdminContracts.action.disableFeatureFlag.description":
    "Explicitly disable a feature flag through the existing update path.",
  "mcpAdminContracts.action.getFeatureFlagHistory.description":
    "Read feature-flag history through the canonical admin audit query path.",
  "mcpAdminContracts.action.listCapabilities.description":
    "List capability rules for a service using the existing capability-rule model.",
  "mcpAdminContracts.action.getCapability.description":
    "Resolve one effective capability through the user-scoped capability read path.",
  "mcpAdminContracts.action.assignCapability.description":
    "Create or upsert a capability rule without introducing a second capability store.",
  "mcpAdminContracts.action.unassignCapability.description":
    "Delete one capability rule through the current destructive confirmation flow.",
  "mcpAdminContracts.action.updateCapability.description":
    "Update a capability rule through the same upsert contract used for assignments.",
  "mcpAdminContracts.action.listAnalyticsMetrics.description":
    "List the approved analytics metrics from the curated MCP whitelist.",
  "mcpAdminContracts.action.listAnalyticsDimensions.description":
    "List the approved analytics dimensions from the curated MCP whitelist.",
  "mcpAdminContracts.action.runAnalyticsQuery.description":
    "Run a bounded analytics query using the existing operational analytics report API.",
  "mcpAdminContracts.action.runAnalyticsPreset.description":
    "Run a curated analytics preset instead of free-form BI-style queries.",
  "mcpAdminContracts.action.listAggregationMetrics.description":
    "List the approved user-aggregation metrics from the MCP whitelist.",
  "mcpAdminContracts.action.listAggregationDimensions.description":
    "List the approved user-aggregation dimensions from the MCP whitelist.",
  "mcpAdminContracts.action.aggregateUsers.description":
    "Run grouped user aggregation over the bounded admin user data surface.",
  "mcpAdminContracts.action.aggregateUsersByPreset.description":
    "Run a curated user-aggregation preset against the bounded aggregation route.",
  "mcpAdminContracts.verification.enableFeatureFlag.description":
    "Use admin audit history to verify the rollout change.",
  "mcpAdminContracts.verification.disableFeatureFlag.description":
    "Use admin audit history to verify the rollout change.",
  "mcpAdminContracts.verification.assignCapability.description":
    "Use admin audit history to verify the stored rule written by the capability assignment.",
  "mcpAdminContracts.verification.unassignCapability.description":
    "Use admin audit history to verify capability-rule deletion.",
  "mcpAdminContracts.verification.updateCapability.description":
    "Use admin audit history to verify the stored rule updated by the capability mutation.",
} as const satisfies Record<McpAdminContractDescriptionKey, string>;
