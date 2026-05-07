import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildAiPluginManifest,
  buildMcpContextResponse,
  buildMcpDiscoveryResponse,
  buildMcpSchemaResponse,
  MCP_ADMIN_ACTIONS,
  MCP_ADMIN_CONTRACT_VERSION,
  MCP_ADMIN_FOUNDATION_ENV_VAR,
  MCP_ADMIN_FOUNDATION_FLAG_ID,
  MCP_ADMIN_REGISTRY_SOURCE,
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

    expect(schema.actions.listFeatureFlags!.execution.path).toBe("/api/ops/feature-flags");
    expect(schema.actions.enableFeatureFlag!.input.flagKey!.required).toBe(true);
    expect(schema.actions.runAnalyticsQuery!.input.metric!.required).toBe(true);
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
