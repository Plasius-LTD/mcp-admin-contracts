import { mcpAdminContractsEnGbTranslations } from "./translations/en-GB.js";

export const mcpAdminContractDescriptionKeys = {
  manifestDescriptionForModel:
    "mcpAdminContracts.manifest.descriptionForModel",
  manifestDescription: "mcpAdminContracts.manifest.description",
  actionListFeatureFlags: "mcpAdminContracts.action.listFeatureFlags.description",
  actionGetFeatureFlag: "mcpAdminContracts.action.getFeatureFlag.description",
  actionUpdateFeatureFlag:
    "mcpAdminContracts.action.updateFeatureFlag.description",
  actionEnableFeatureFlag:
    "mcpAdminContracts.action.enableFeatureFlag.description",
  actionDisableFeatureFlag:
    "mcpAdminContracts.action.disableFeatureFlag.description",
  actionGetFeatureFlagHistory:
    "mcpAdminContracts.action.getFeatureFlagHistory.description",
  actionListCapabilities:
    "mcpAdminContracts.action.listCapabilities.description",
  actionGetCapability: "mcpAdminContracts.action.getCapability.description",
  actionAssignCapability:
    "mcpAdminContracts.action.assignCapability.description",
  actionUnassignCapability:
    "mcpAdminContracts.action.unassignCapability.description",
  actionUpdateCapability:
    "mcpAdminContracts.action.updateCapability.description",
  actionListAnalyticsMetrics:
    "mcpAdminContracts.action.listAnalyticsMetrics.description",
  actionListAnalyticsDimensions:
    "mcpAdminContracts.action.listAnalyticsDimensions.description",
  actionRunAnalyticsQuery:
    "mcpAdminContracts.action.runAnalyticsQuery.description",
  actionRunAnalyticsPreset:
    "mcpAdminContracts.action.runAnalyticsPreset.description",
  actionListAggregationMetrics:
    "mcpAdminContracts.action.listAggregationMetrics.description",
  actionListAggregationDimensions:
    "mcpAdminContracts.action.listAggregationDimensions.description",
  actionAggregateUsers: "mcpAdminContracts.action.aggregateUsers.description",
  actionAggregateUsersByPreset:
    "mcpAdminContracts.action.aggregateUsersByPreset.description",
  actionSearchAssetCatalog:
    "mcpAdminContracts.action.searchAssetCatalog.description",
  actionGetAssetManifest:
    "mcpAdminContracts.action.getAssetManifest.description",
  actionRequestAsset: "mcpAdminContracts.action.requestAsset.description",
  actionSearchAssetSources:
    "mcpAdminContracts.action.searchAssetSources.description",
  actionStageAssetSource:
    "mcpAdminContracts.action.stageAssetSource.description",
  actionCreateAssetJob: "mcpAdminContracts.action.createAssetJob.description",
  actionUploadAssetSource:
    "mcpAdminContracts.action.uploadAssetSource.description",
  actionProcessAssetJob:
    "mcpAdminContracts.action.processAssetJob.description",
  actionRenderAssetReview:
    "mcpAdminContracts.action.renderAssetReview.description",
  actionReviewAssetCandidate:
    "mcpAdminContracts.action.reviewAssetCandidate.description",
  actionPromoteAsset: "mcpAdminContracts.action.promoteAsset.description",
  actionRollbackAsset: "mcpAdminContracts.action.rollbackAsset.description",
  actionGetAssetJobStatus:
    "mcpAdminContracts.action.getAssetJobStatus.description",
  actionGetUserTokenWallet:
    "mcpAdminContracts.action.getUserTokenWallet.description",
  actionListUserTokenActivity:
    "mcpAdminContracts.action.listUserTokenActivity.description",
  actionListTokenAdjustments:
    "mcpAdminContracts.action.listTokenAdjustments.description",
  actionProposeTokenCredit:
    "mcpAdminContracts.action.proposeTokenCredit.description",
  actionApproveTokenCredit:
    "mcpAdminContracts.action.approveTokenCredit.description",
  actionRejectTokenCredit:
    "mcpAdminContracts.action.rejectTokenCredit.description",
  actionReverseTokenCredit:
    "mcpAdminContracts.action.reverseTokenCredit.description",
  verificationEnableFeatureFlag:
    "mcpAdminContracts.verification.enableFeatureFlag.description",
  verificationDisableFeatureFlag:
    "mcpAdminContracts.verification.disableFeatureFlag.description",
  verificationAssignCapability:
    "mcpAdminContracts.verification.assignCapability.description",
  verificationUnassignCapability:
    "mcpAdminContracts.verification.unassignCapability.description",
  verificationUpdateCapability:
    "mcpAdminContracts.verification.updateCapability.description",
  verificationPromoteAsset:
    "mcpAdminContracts.verification.promoteAsset.description",
  verificationRollbackAsset:
    "mcpAdminContracts.verification.rollbackAsset.description",
  verificationTokenAdjustment:
    "mcpAdminContracts.verification.tokenAdjustment.description",
} as const;

export type McpAdminContractDescriptionKey =
  (typeof mcpAdminContractDescriptionKeys)[keyof typeof mcpAdminContractDescriptionKeys];

export { mcpAdminContractsEnGbTranslations };

export const mcpAdminContractsTranslations = {
  "en-GB": mcpAdminContractsEnGbTranslations,
} as const;

/**
 * Resolve package-owned defaults for protocol surfaces that are not passed a
 * runtime translator.
 */
export function getMcpAdminContractDefaultTranslation(
  key: McpAdminContractDescriptionKey,
): string {
  return mcpAdminContractsEnGbTranslations[key] ?? key;
}
