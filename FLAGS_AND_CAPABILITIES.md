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
