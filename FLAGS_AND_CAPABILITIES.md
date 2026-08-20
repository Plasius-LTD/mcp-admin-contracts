# FLAGS_AND_CAPABILITIES.md

## 1. Purpose

This package publishes public-safe MCP admin contract metadata. It may expose
feature-flag and capability identifiers as data, but it must not evaluate or
enforce rollout decisions at runtime.

## 2. Primary Rules

- Every parent feature still requires a named feature flag.
- This package may export stable flag keys and capability identifiers used by
  consuming services or clients.
- Runtime flag evaluation, entitlement checks, and capability enforcement must
  remain in the consuming application boundary, not in this package.

## 3. Package-Specific Guidance

- Treat flags and capabilities here as contract metadata only.
- Do not add environment reads, remote config calls, user/session inspection, or
  server-side gating logic.
- When a change adds or modifies an exported rollout identifier, document:
  - the canonical key
  - the owning evaluator outside this package
  - the consumer-visible fallback behavior

## 4. Cross-Repo Feature Inheritance

- When this repo participates in a feature owned elsewhere, reuse the parent
  feature flag unless there is an explicitly documented reason to add another.
- For package-only governance or documentation tasks with no runtime behavior
  change, document the inherited feature flag as runtime `N/A`.

Current inherited example:

- `repo-review.2026-05-17.hardening.enabled` is runtime `N/A` for task
  `Plasius-LTD/mcp-admin-contracts#12` because the change restores governance
  documentation only.

Current runtime-relevant inherited flags for Admin Token reporting:

- `economy.admin-history.enabled`
- `mcp.admin-economy-history.enabled`

The hosted site is the source-of-truth evaluator. This package exports those
keys, `mcp:access`, `admin.economy.read`, and
`economy.finance-operations.view` as discovery metadata only. Disabled or
unauthorized callers must receive neither callable tool discovery nor data.

Current feedback contract:

- `feedback.mcp.enabled` is the canonical parent rollout flag for the
  read-only feedback action family.
- `admin.feedback.read` is carried as the required capability. Complete
  action-level OAuth metadata contains `mcp:access` and
  `admin.feedback.read`.
- Each feedback action's unified read-only access metadata repeats the complete
  scope, capability, and rollout tuple so consuming runtimes can enforce it as
  one fail-closed requirement set.
- The global AI-plugin manifest keeps its existing `openid email profile mcp:access`
  scopes until the site OAuth issuer and protected-resource metadata are
  coordinated; feedback scope publication is not performed unconditionally.
- The consuming admin/MCP runtime owns flag evaluation, entitlement,
  authentication, fail-closed rate limits, and audit. If either control is
  unavailable, feedback actions must be omitted or rejected.

Current canonical model-resolution contract:

- `asset.pipeline.unified-ai-assets.enabled` is the required parent flag for
  all eight canonical snake_case model tools.
- `asset.pipeline.external-model-harvest.enabled` and
  `asset.pipeline.ai-model-generation.enabled` are conditional kill switches;
  the host evaluates them only when the corresponding provider or generator
  fallback is attempted.
- The package carries canonical `asset.catalog.request`,
  `asset.catalog.confirm`, `asset.catalog.review`, `asset.source.manage`, and
  `asset.pipeline.mcp.manage` capability identifiers as contract metadata.
- Its model-family OAuth registry contains `mcp:access` and all five asset
  capability scopes for issuer and protected-resource discovery; individual
  tool descriptors retain their narrower canonical scope requirements.
- Tool-specific OAuth scopes, annotations, and security schemes are consumed
  directly from `@plasius/asset-mcp`; this package does not broaden them.
- The hosted MCP service is the owning evaluator. Disabled or unauthorized
  tools and resources must be omitted or rejected fail closed; this package
  performs no runtime evaluation.

## 5. Testing Expectations

- Tests for new or changed exported flag/capability identifiers must verify the
  public contract shape.
- Rollout behavior tests belong in the consuming runtime, not in this package,
  unless the package adds a pure response-builder surface that embeds the
  metadata.

## 6. Completion Rules

Do not mark rollout-related work complete until:

- the parent feature flag is documented
- exported identifiers remain stable and tested
- README/ADR/task notes explain whether the change is runtime-relevant or `N/A`
