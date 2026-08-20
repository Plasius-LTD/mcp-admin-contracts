import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createI18n } from "@plasius/translations";
import {
  MODEL_MCP_CONTRACT_VERSION,
  MODEL_MCP_EXTERNAL_HARVEST_FEATURE_FLAG_ID,
  MODEL_MCP_GENERATION_FEATURE_FLAG_ID,
  MODEL_MCP_RESOURCE_TEMPLATES,
  MODEL_MCP_TOOL_NAMES,
  MODEL_MCP_UNIFIED_FEATURE_FLAG_ID,
  listModelMcpToolDefinitions,
} from "@plasius/asset-mcp";
import { MODEL_RESOLUTION_CONTRACT_VERSION } from "@plasius/asset-contracts";
import {
  MCP_ADMIN_ACTIONS,
  MCP_ADMIN_CONTRACT_VERSION,
  MCP_ADMIN_MODEL_CAPABILITIES,
  MCP_ADMIN_MODEL_OAUTH_SCOPES,
  MCP_ADMIN_MODEL_RESOLUTION_CONTRACT_VERSION,
  MCP_ADMIN_MODEL_REGISTRY_SOURCE,
  MCP_ADMIN_MODEL_TOOL_CONTRACT_VERSION,
  MCP_ASSET_CATALOG_CONFIRM_CAPABILITY,
  MCP_ASSET_CATALOG_REQUEST_CAPABILITY,
  MCP_ASSET_CATALOG_REVIEW_CAPABILITY,
  MCP_ASSET_PIPELINE_MANAGE_CAPABILITY,
  MCP_ASSET_SOURCE_MANAGE_CAPABILITY,
  buildMcpContextResponse,
  buildMcpDiscoveryResponse,
  buildMcpSchemaResponse,
  listMcpModelResourceTemplates,
  listMcpModelToolSummaries,
  mcpAdminContractDescriptionKeys,
  mcpAdminContractsEnGbTranslations,
  mcpAdminContractsTranslations,
} from "../src/index.js";

const canonicalTools = listModelMcpToolDefinitions();

describe("canonical model-resolution discovery", () => {
  it("adds all eight canonical snake_case tools without changing legacy descriptors", () => {
    const discovery = buildMcpDiscoveryResponse();

    expect(MCP_ADMIN_CONTRACT_VERSION).toBe("2026-08-20.v7");
    expect(discovery.modelTools?.map(({ name }) => name)).toEqual(
      MODEL_MCP_TOOL_NAMES,
    );
    expect(discovery.modelSourceOfTruth).toBe("@plasius/asset-mcp");
    expect(discovery.actions).toHaveLength(48);
    expect(discovery.actions.some(({ name }) => name.includes("_model_"))).toBe(
      false,
    );

    const serializedLegacyActions = JSON.stringify(MCP_ADMIN_ACTIONS);
    expect(Buffer.byteLength(serializedLegacyActions)).toBe(158_141);
    expect(createHash("sha256").update(serializedLegacyActions).digest("hex")).toBe(
      "c3a42439942329e3b23ad40b656032c74ba7201ca24e81e5429e8d0a338bea6b",
    );
  });

  it("reuses canonical schemas, annotations, security and rollout metadata", () => {
    const schema = buildMcpSchemaResponse();

    for (const canonical of canonicalTools) {
      const advertised = schema.modelTools?.[canonical.name];
      expect(advertised).toBeDefined();
      expect(advertised?.inputSchema).toBe(canonical.inputSchema);
      expect(advertised?.outputSchema).toBe(canonical.outputSchema);
      expect(advertised?.annotations).toEqual(canonical.annotations);
      expect(advertised?.requiredOAuthScopes).toEqual(
        canonical.requiredOAuthScopes,
      );
      expect(advertised?.requiredCapability).toBe(
        canonical.requiredCapability,
      );
      expect(advertised?.securitySchemes).toEqual(canonical.securitySchemes);
      expect(advertised?._meta).toEqual(canonical._meta);
      expect(advertised?.featureFlags).toEqual(canonical.featureFlags);
      expect(advertised?.rollout).toEqual(canonical.rollout);
      expect(advertised?.execution).toEqual({
        protocol: "json-rpc-2.0",
        method: "POST",
        path: "/api/mcp",
        rpcMethod: "tools/call",
        toolName: canonical.name,
      });
      expect(advertised?.verificationNotes.length).toBeGreaterThan(0);
      expect(advertised?.verificationNotes.every((note) => note.length > 0)).toBe(
        true,
      );
    }

    expect(Object.keys(schema.modelTools ?? {})).toEqual(MODEL_MCP_TOOL_NAMES);
    expect(schema.modelSourceOfTruth).toBe(MCP_ADMIN_MODEL_REGISTRY_SOURCE);

    expect(schema.actions.searchAssetCatalog?.execution).toEqual(
      MCP_ADMIN_ACTIONS.find(({ name }) => name === "searchAssetCatalog")
        ?.execution,
    );
  });

  it("advertises conditional provider and generator flags only where canonical", () => {
    const summaries = listMcpModelToolSummaries();
    const byName = Object.fromEntries(
      summaries.map((summary) => [summary.name, summary]),
    );

    expect(byName.resolve_model_request?.rollout).toEqual({
      requiredFeatureFlag: MODEL_MCP_UNIFIED_FEATURE_FLAG_ID,
      conditionalFeatureFlags: [
        MODEL_MCP_EXTERNAL_HARVEST_FEATURE_FLAG_ID,
        MODEL_MCP_GENERATION_FEATURE_FLAG_ID,
      ],
    });
    expect(byName.retry_model_resolution?.rollout).toEqual(
      byName.resolve_model_request?.rollout,
    );
    expect(byName.search_model_catalog?.rollout.conditionalFeatureFlags).toEqual(
      [],
    );
  });

  it("publishes canonical authenticated model resources", () => {
    const resources = listMcpModelResourceTemplates();
    const discovery = buildMcpDiscoveryResponse();
    const schema = buildMcpSchemaResponse();

    expect(resources).toEqual(MODEL_MCP_RESOURCE_TEMPLATES);
    expect(discovery.modelResources).toEqual(MODEL_MCP_RESOURCE_TEMPLATES);
    expect(schema.modelResources).toEqual(MODEL_MCP_RESOURCE_TEMPLATES);
    expect(resources).toHaveLength(5);
    expect(resources.every(({ authenticated }) => authenticated)).toBe(true);
    expect(resources.every(({ uriTemplate }) => uriTemplate.startsWith("mcp://models/"))).toBe(
      true,
    );
  });

  it("carries exact contract sources, OAuth scopes and capability identifiers", () => {
    expect(MCP_ADMIN_MODEL_TOOL_CONTRACT_VERSION).toBe(
      MODEL_MCP_CONTRACT_VERSION,
    );
    expect(MCP_ADMIN_MODEL_RESOLUTION_CONTRACT_VERSION).toBe(
      MODEL_RESOLUTION_CONTRACT_VERSION,
    );
    expect(MCP_ADMIN_MODEL_OAUTH_SCOPES).toEqual([
      "mcp:access",
      "asset.catalog.request",
      "asset.catalog.confirm",
      "asset.catalog.review",
      "asset.source.manage",
      "asset.pipeline.mcp.manage",
    ]);
    expect(MCP_ASSET_CATALOG_REQUEST_CAPABILITY).toBe(
      "asset.catalog.request",
    );
    expect(MCP_ASSET_CATALOG_CONFIRM_CAPABILITY).toBe(
      "asset.catalog.confirm",
    );
    expect(MCP_ASSET_CATALOG_REVIEW_CAPABILITY).toBe(
      "asset.catalog.review",
    );
    expect(MCP_ASSET_SOURCE_MANAGE_CAPABILITY).toBe("asset.source.manage");
    expect(MCP_ASSET_PIPELINE_MANAGE_CAPABILITY).toBe(
      "asset.pipeline.mcp.manage",
    );
    expect(MCP_ADMIN_MODEL_CAPABILITIES).toEqual({
      catalogRequest: "asset.catalog.request",
      catalogConfirm: "asset.catalog.confirm",
      catalogReview: "asset.catalog.review",
      sourceManage: "asset.source.manage",
      pipelineManage: "asset.pipeline.mcp.manage",
    });
  });

  it("provides en-GB text for every canonical tool", () => {
    const i18n = createI18n({
      language: "en-GB",
      fallback: "en-GB",
      translations: mcpAdminContractsTranslations,
    });
    const summaries = listMcpModelToolSummaries();

    for (const [index, summary] of summaries.entries()) {
      const canonical = canonicalTools[index];
      expect(canonical).toBeDefined();
      expect(summary.descriptionDefault).toBe(canonical?.description);
      expect(summary.description).toBe(canonical?.description);
      expect(i18n.t(summary.descriptionKey)).toBe(canonical?.description);
      expect(mcpAdminContractsEnGbTranslations[summary.descriptionKey]).toBe(
        canonical?.description,
      );
    }

    expect(
      mcpAdminContractDescriptionKeys.actionResolveModelRequest,
    ).toBe("mcpAdminContracts.action.resolveModelRequest.description");
  });

  it("adds one model-resolution context family with canonical execution metadata", () => {
    const schema = buildMcpSchemaResponse();
    const context = buildMcpContextResponse({
      origin: "https://plasius.co.uk",
      rollout: {
        foundationFlagId: "mcp.admin.foundation.enabled",
        foundationEnabled: true,
        foundationSource: "stored-feature-flag",
        envOverride: "MCP_ADMIN_FOUNDATION_ENABLED",
      },
    });

    expect(context.modelResolution).toEqual({
      toolContractVersion: MODEL_MCP_CONTRACT_VERSION,
      sourceOfTruth: "@plasius/asset-mcp",
      resolutionContractVersion: MODEL_RESOLUTION_CONTRACT_VERSION,
      endpoint: "/api/mcp",
      protocol: "json-rpc-2.0",
      rpcMethod: "tools/call",
      requiredFeatureFlag: MODEL_MCP_UNIFIED_FEATURE_FLAG_ID,
      conditionalFeatureFlags: [
        MODEL_MCP_EXTERNAL_HARVEST_FEATURE_FLAG_ID,
        MODEL_MCP_GENERATION_FEATURE_FLAG_ID,
      ],
      tools: [...MODEL_MCP_TOOL_NAMES],
      resourceTemplates: MODEL_MCP_RESOURCE_TEMPLATES.map(({ uriTemplate }) =>
        uriTemplate,
      ),
    });
    expect(schema.contextShape.modelResolution?.type).toBe("object");
    expect(
      schema.contextShape.modelResolution?.properties?.rpcMethod?.constValue,
    ).toBe("tools/call");
  });

  it("keeps shared verification notes and context schemas immutable across calls", () => {
    const firstSummaries = listMcpModelToolSummaries();
    const firstNotes = firstSummaries[0]?.verificationNotes;
    expect(firstNotes).toBeDefined();
    expect(Object.isFrozen(firstNotes)).toBe(true);
    expect(() => {
      (firstNotes as string[])[0] = "tampered";
    }).toThrow(TypeError);

    expect(listMcpModelToolSummaries()[0]?.verificationNotes[0]).not.toBe(
      "tampered",
    );
    expect(
      buildMcpSchemaResponse().modelTools?.list_model_search_rankers
        .verificationNotes[0],
    ).not.toBe("tampered");

    const firstContextShape = buildMcpSchemaResponse().contextShape;
    const modelResolutionShape = firstContextShape.modelResolution;
    expect(Object.isFrozen(firstContextShape)).toBe(true);
    expect(Object.isFrozen(modelResolutionShape)).toBe(true);
    expect(Object.isFrozen(modelResolutionShape?.properties)).toBe(true);
    expect(() => {
      (modelResolutionShape?.properties as Record<string, unknown>)[
        "attacker.flag"
      ] = { type: "boolean", description: "tampered" };
    }).toThrow(TypeError);

    expect(
      buildMcpSchemaResponse().contextShape.modelResolution?.properties,
    ).not.toHaveProperty("attacker.flag");
  });
});
