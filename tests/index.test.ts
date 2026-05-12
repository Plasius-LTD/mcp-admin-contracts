import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildAiPluginManifest,
  buildMcpContextResponse,
  buildMcpDiscoveryResponse,
  buildMcpSchemaResponse,
  MCP_ADMIN_ACTIONS,
  MCP_ADMIN_ANALYTICS_DIMENSIONS,
  MCP_ADMIN_ANALYTICS_METRICS,
  MCP_ADMIN_ANALYTICS_PRESETS,
  MCP_ADMIN_CONTRACT_VERSION,
  MCP_ADMIN_FOUNDATION_ENV_VAR,
  MCP_ADMIN_FOUNDATION_FLAG_ID,
  MCP_ADMIN_REGISTRY_SOURCE,
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
    expect(response.actions.map((action) => action.name)).not.toContain("createPost");
    expect(response.actions.map((action) => action.name)).not.toContain("randomNumber");
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
    expect(schema.contextShape.extensionRules!.properties?.notes?.itemType).toBe("string");
    expect(Object.keys(schema.actions)).not.toContain("randomNumber");
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
      ]),
    );
  });

  it("builds the approved plugin manifest from the request origin", () => {
    const manifest = buildAiPluginManifest("https://plasius.co.uk/api/mcp/context");

    expect(manifest).toMatchObject({
      schema_version: "1.0.0",
      name_for_model: "plasius_admin_control_plane",
      context_url: "https://plasius.co.uk/api/mcp/context",
      actions_url: "https://plasius.co.uk/api/mcp/actions",
      schema_url: "https://plasius.co.uk/api/mcp/schema",
      auth: {
        type: "oauth",
        client_url: "https://plasius.co.uk/api/login",
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
