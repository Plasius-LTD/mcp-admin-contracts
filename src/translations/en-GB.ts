import type { McpAdminContractDescriptionKey } from "../i18n.js";

export const mcpAdminContractsEnGbTranslations = {
  "mcpAdminContracts.manifest.descriptionForModel":
    "OAuth-protected MCP discovery manifest for the Plasius admin control plane covering feature flags, capabilities, analytics, pseudonymous Token finance reads, and audit-backed operations.",
  "mcpAdminContracts.manifest.description":
    "Authenticated admin MCP discovery for the Plasius feature flag, capability, analytics, pseudonymous Token reporting, and audit control plane.",
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
  "mcpAdminContracts.action.listAdminTokenActivity.description":
    "List bounded pseudonymous Token activity after re-checking MCP scope, finance capabilities, and stored rollout flags.",
  "mcpAdminContracts.action.getAdminTokenTrends.description":
    "Read privacy-suppressed Token acquisition and usage trends with explainable advisory anomaly indicators.",
  "mcpAdminContracts.action.searchAssetCatalog.description":
    "Search promoted asset catalog records without live third-party lookup.",
  "mcpAdminContracts.action.getAssetManifest.description":
    "Fetch a promoted player-safe runtime asset manifest reference.",
  "mcpAdminContracts.action.requestAsset.description":
    "Queue a governed missing-asset request when no promoted catalog match exists.",
  "mcpAdminContracts.action.searchAssetSources.description":
    "Search approved external source registries for candidate assets without exposing raw download URLs.",
  "mcpAdminContracts.action.stageAssetSource.description":
    "Stage one approved external asset source for governed intake and license review.",
  "mcpAdminContracts.action.createAssetJob.description":
    "Create a governed asset pipeline job under the hosted backend MCP surface.",
  "mcpAdminContracts.action.uploadAssetSource.description":
    "Attach source blob references or uploaded source descriptors to an asset job.",
  "mcpAdminContracts.action.processAssetJob.description":
    "Queue validation, metadata cleanup, conversion, LOD, collision, texture, and packaging work for an asset job.",
  "mcpAdminContracts.action.renderAssetReview.description":
    "Queue deterministic review screenshot capture and debug evidence generation for an asset job.",
  "mcpAdminContracts.action.reviewAssetCandidate.description":
    "Record an asset review decision without bypassing promotion preconditions.",
  "mcpAdminContracts.action.promoteAsset.description":
    "Promote an approved asset candidate to an immutable runtime manifest reference.",
  "mcpAdminContracts.action.rollbackAsset.description":
    "Rollback an asset runtime channel to a previous promoted manifest version.",
  "mcpAdminContracts.action.getAssetJobStatus.description":
    "Read governed asset job status, planned processing work, and evidence references.",
  "mcpAdminContracts.action.getUserTokenWallet.description":
    "Read an account's server-resolved Token wallet summary without exposing provider or payment data.",
  "mcpAdminContracts.action.listUserTokenActivity.description":
    "Read a bounded, cursor-paginated Token activity history for one account.",
  "mcpAdminContracts.action.listTokenAdjustments.description":
    "List audited Token adjustment proposals and their approval state.",
  "mcpAdminContracts.action.proposeTokenCredit.description":
    "Propose a positive Token credit for a server-resolved personal wallet; a distinct owner must approve it.",
  "mcpAdminContracts.action.approveTokenCredit.description":
    "Approve a preview-bound Token credit proposed by a different owner.",
  "mcpAdminContracts.action.rejectTokenCredit.description":
    "Reject a pending Token credit without mutating the wallet.",
  "mcpAdminContracts.action.reverseTokenCredit.description":
    "Propose an immutable compensating reversal of an earlier owner Token credit.",
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
  "mcpAdminContracts.verification.promoteAsset.description":
    "Use asset promotion history and admin audit events to verify the immutable runtime manifest promotion.",
  "mcpAdminContracts.verification.rollbackAsset.description":
    "Use asset promotion history and admin audit events to verify the runtime channel rollback.",
  "mcpAdminContracts.verification.tokenAdjustment.description":
    "Read the adjustment and Token activity history to verify its immutable proposal, decision, and ledger result.",
} as const satisfies Record<McpAdminContractDescriptionKey, string>;
