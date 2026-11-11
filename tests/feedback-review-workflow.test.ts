import {
  FEEDBACK_REVIEW_KINDS,
  FEEDBACK_REVIEW_OUTCOMES,
  FEEDBACK_REVIEW_STATUSES,
  FEEDBACK_REVIEW_WORKFLOW_CONTRACT_VERSION,
  FeedbackReviewItemDetailSchema,
  FeedbackReviewQueuePageSchema,
  FeedbackReviewQueueQuerySchema,
  FeedbackReviewTransitionRequestSchema,
  FeedbackReviewWorkflowStateSchema,
} from "@plasius/schema";
import { describe, expect, it } from "vitest";
import * as mcp from "../src/index.js";

const names = [
  "listFeedbackReviewQueue",
  "getFeedbackReviewItem",
  "markFeedbackReviewed",
  "processFeedback",
  "reopenFeedback",
] as const;
const [list, get, mark, process, reopen] = names;
const reads = [list, get] as const;
const writes = [mark, process, reopen] as const;
const readScopes = ["mcp:access", "admin.feedback.read"];
const readFlags = ["feedback.mcp.enabled", "feedback.review-workflow.enabled"];
const action = (name: (typeof names)[number]) => mcp.MCP_ADMIN_FEEDBACK_REVIEW_ACTIONS[name];

describe("feedback workflow MCP contracts", () => {
  it("publishes exactly five immutable opt-in descriptors without widening default discovery or grants", () => {
    const registry = mcp.MCP_ADMIN_FEEDBACK_REVIEW_ACTIONS;
    expect(Object.keys(registry)).toEqual(names);
    expect(Object.isFrozen(registry)).toBe(true);
    expect(mcp.MCP_ADMIN_FEEDBACK_REVIEW_HOST_DEFAULT_ENABLED).toBe(false);
    expect(mcp.MCP_ADMIN_FEEDBACK_REQUIRED_OAUTH_SCOPES).toEqual(readScopes);
    expect(mcp.buildAiPluginManifest("https://example.invalid").auth.scope).toBe("openid email profile mcp:access");
    for (const name of names) {
      const descriptor = action(name);
      expect(descriptor.name).toBe(name);
      expect(mcp.MCP_ADMIN_ACTIONS.some((legacy) => legacy.name === name)).toBe(false);
      expect(mcp.buildMcpDiscoveryResponse().actions.some((legacy) => legacy.name === name)).toBe(false);
      expect(mcp.buildMcpSchemaResponse().actions).not.toHaveProperty(name);
      expect(descriptor.descriptionDefault).toBe(mcp.getMcpAdminContractDefaultTranslation(descriptor.descriptionKey));
      expect(descriptor.descriptionDefault).not.toBe(descriptor.descriptionKey);
      expect(descriptor.schemaSource.contractVersion).toBe(FEEDBACK_REVIEW_WORKFLOW_CONTRACT_VERSION);
      expect(Object.isFrozen(descriptor.access.rolloutFlags)).toBe(true);
    }
    for (const legacy of mcp.MCP_ADMIN_FEEDBACK_ACTIONS) {
      expect(legacy.access?.mode).toBe("read-only");
      expect(legacy.oauthScopes).toEqual(readScopes);
    }
  });

  it.each(reads)("%s uses the closed read-only grant and never changes review state", (name) => {
    const descriptor = action(name);
    expect(descriptor.access).toEqual({
      oauthScopes: readScopes, capabilities: ["admin.feedback.read"],
      rolloutFlags: readFlags, mode: "read-only", identityResolution: "not-available",
    });
    expect(descriptor.requiredCapability).toBe("admin.feedback.read");
    expect(descriptor.requiresExplicitUserIntent).toBe(false);
    expect(descriptor.annotations).toEqual({
      readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false,
    });
    expect(descriptor.execution.method).toBe("GET");
  });

  it.each(writes)("%s requires a protected grant and an explicit action on one packet", (name) => {
    const descriptor = action(name);
    expect(descriptor.access).toEqual({
      oauthScopes: [...readScopes, "admin.feedback.manage"],
      capabilities: ["admin.feedback.read", "admin.feedback.manage"],
      rolloutFlags: [...readFlags, "feedback.processing.enabled"],
      mode: "mutation", identityResolution: "not-available",
    });
    expect(descriptor.requiredCapability).toBe("admin.feedback.manage");
    expect(descriptor.requiresExplicitUserIntent).toBe(true);
    expect(descriptor.descriptionDefault).toMatch(/explicit.*(user|request)/i);
    expect(descriptor.annotations).toEqual({
      readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false,
    });
    expect(descriptor.execution).toMatchObject({
      method: "POST", path: "/api/admin/feedback/review-items/{kind}/{packetId}/transitions",
    });
    expect(descriptor.input.expectedRevision).toMatchObject({ required: true, minimum: 1, maximum: Number.MAX_SAFE_INTEGER - 1 });
    expect(descriptor.input.idempotencyKey).toMatchObject({ required: true, minLength: 36, maxLength: 36, format: "uuid" });
    expect(Object.keys(descriptor.output)).toEqual(["state"]);
    expect(descriptor.output.state).toMatchObject({ additionalProperties: false });
  });

  it("binds three named writes to closed canonical transitions; only process takes an outcome", () => {
    expect(action(mark).transitionAction).toBe("mark-reviewed");
    expect(action(process).transitionAction).toBe("process");
    expect(action(reopen).transitionAction).toBe("reopen");
    expect(action(mark).input).not.toHaveProperty("outcome");
    expect(action(reopen).input).not.toHaveProperty("outcome");
    expect(action(process).input.outcome).toMatchObject({ required: true, enum: FEEDBACK_REVIEW_OUTCOMES });
    for (const name of writes) {
      expect(action(name).input).not.toHaveProperty("action");
      expect(action(name).input).not.toHaveProperty("note");
      expect(FeedbackReviewTransitionRequestSchema.validate({
        action: action(name).transitionAction, expectedRevision: 1,
        ...(name === process ? { outcome: "no-action" } : {}),
      }).valid).toBe(true);
      expect(action(name).schemaSource.schemaNames).toEqual([
        "FeedbackReviewTransitionRequestSchema", "FeedbackReviewWorkflowStateSchema",
      ]);
    }
    expect(FeedbackReviewWorkflowStateSchema.meta.version).toBe(FEEDBACK_REVIEW_WORKFLOW_CONTRACT_VERSION);
  });

  it("describes bounded canonical queue and history projections with no persistence or actor fields", () => {
    const queue = action(list);
    const detail = action(get);
    expect(queue.input.kind).toMatchObject({ enum: FEEDBACK_REVIEW_KINDS });
    expect(queue.input.status).toMatchObject({ enum: FEEDBACK_REVIEW_STATUSES });
    expect(queue.input.limit).toMatchObject({ required: false, minimum: 1, maximum: 100 });
    expect(queue.input.cursor).toMatchObject({ maxLength: 4096 });
    expect(queue.output.items).toMatchObject({
      maxItems: 100,
      items: { additionalProperties: false, properties: { packetId: { format: "uuid" }, status: { enum: FEEDBACK_REVIEW_STATUSES } } },
    });
    expect(queue.schemaSource.schemaNames).toEqual(["FeedbackReviewQueueQuerySchema", "FeedbackReviewQueuePageSchema"]);
    expect(detail.input.packetId).toMatchObject({ required: true, format: "uuid" });
    expect(detail.input.historyCursor).toMatchObject({ maxLength: 4096 });
    expect(detail.output.history).toMatchObject({
      additionalProperties: false,
      properties: { events: { maxItems: 25, items: { additionalProperties: false } } },
    });
    expect(detail.schemaSource.schemaNames).toEqual(["FeedbackReviewItemDetailSchema"]);
    for (const schema of [FeedbackReviewItemDetailSchema, FeedbackReviewQueuePageSchema, FeedbackReviewQueueQuerySchema]) {
      expect(schema.meta.version).toBe(FEEDBACK_REVIEW_WORKFLOW_CONTRACT_VERSION);
    }
    for (const name of names) {
      const descriptor = action(name);
      expect(descriptor.inputAdditionalProperties).toBe(false);
      expect(descriptor.outputAdditionalProperties).toBe(false);
      expect(JSON.stringify(descriptor.output)).not.toMatch(/"(actorId|reporterId|note|externalReference|operationId|auditIntentId|continuation|leaseEpoch|writtenAt|ttl)"/);
    }
  });
});
