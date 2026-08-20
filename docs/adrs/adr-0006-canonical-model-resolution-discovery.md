# ADR 0006: Canonical Model-Resolution Discovery

## Status

Accepted

## Context

The hosted MCP surface needs public-safe discovery for the eight canonical
model-resolution tools. This package already publishes legacy REST-backed
admin action descriptors, while `@plasius/asset-mcp` owns the canonical MCP
tool names, JSON Schemas, annotations, OAuth metadata, capability requirements,
rollout metadata, review-result metadata, and authenticated model resources.

Copying those schemas or security fields into this package would create two
authorities and permit drift. Adding the snake_case tools to the legacy action
array would also blur JSON-RPC `tools/call` execution with existing REST route
adapters and could break consumers that treat that array as the legacy registry.

## Decision

The package consumes pinned `@plasius/asset-mcp 0.1.6` and
`@plasius/asset-contracts 0.3.1` releases.

- `buildMcpDiscoveryResponse` adds `modelTools` summaries and canonical
  `modelResources` alongside, rather than inside, the legacy `actions` array.
- `buildMcpSchemaResponse` references each canonical input schema, output
  schema, annotation set, security scheme, capability, review-result record,
  and rollout record directly from `@plasius/asset-mcp`.
- Execution metadata identifies JSON-RPC 2.0 `tools/call` at `POST /api/mcp`.
  Existing descriptors retain their REST execution records unchanged.
- Bounded verification notes identify whether the canonical result itself or
  a follow-up `get_model_resolution` call verifies the operation.
- Shared verification-note arrays and the exported context schema are deeply
  frozen so consumer mutation cannot alter later discovery responses.
- The context response publishes the canonical tool and model-resolution
  contract versions, exact tool names, resource templates, required parent
  flag, and conditional provider/generator flags.
- The model-family OAuth registry contains `mcp:access` plus all five asset
  capability scopes for issuer and protected-resource publication. Per-tool
  scopes remain the exact narrower sets owned by `@plasius/asset-mcp`.
- New response fields are optional in the exported TypeScript interfaces for
  additive source compatibility, while package builders always populate them.
- En-GB translation keys are package-owned display metadata. Their defaults
  must exactly equal the pinned canonical descriptions or discovery building
  fails closed.
- Runtime authentication, authorization, ownership, rollout evaluation,
  resource access, audit, and tool execution remain outside this package.

The parent flag is `asset.pipeline.unified-ai-assets.enabled`. External
provider acquisition and future generation use the conditional flags
`asset.pipeline.external-model-harvest.enabled` and
`asset.pipeline.ai-model-generation.enabled` respectively. This package only
advertises those identifiers.

## Consequences

Hosted consumers can build public discovery, schemas, and context without
reimplementing model contracts. Canonical package upgrades are explicit and a
description mismatch fails visibly. Legacy clients continue to see the same 48
legacy descriptor objects and may ignore the additive fields.

Publishing this package alone does not make any model tool available. The
host must register the canonical tools and resources, align OAuth protected
resource metadata, enforce capabilities and rollout flags, and pass its own
integration and production checks.
