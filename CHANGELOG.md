# Changelog

## Unreleased

- **Added**
  - Added a privacy-safe, read-only `feedback` domain for bounded bug health,
    satisfaction, deterministic alerts, processor freshness, and
    reporter-identifier-free structured feedback entries.
  - Added stable `feedback.mcp.enabled` rollout and `admin.feedback.read`
    capability metadata, complete action-level `mcp:access` plus
    `admin.feedback.read` OAuth scope metadata, en-GB descriptions, and
    machine-readable privacy exclusions and bounds.
  - Added canonical `@plasius/schema` packet, aggregate, advisory, diagnostics,
    and processor-checkpoint projections with pinned parity coverage.

- **Changed**
  - Bumped the MCP admin discovery contract to `2026-07-29.v4`; the global
    plugin manifest retains its existing base scopes until site OAuth issuer
    coordination is complete.
  - Modelled structured-entry filters as exact `packetType` variants so bug
    and review filters cannot be combined, and documented the released
    `@plasius/schema ^1.4.0` direct-consumption release gate.

- **Fixed**
  - (placeholder)

- **Security**
  - Closed every feedback-specific input and output object projection with
    `additionalProperties: false` so undeclared fields cannot cross the
    Admin/MCP contract boundary.
  - Made account, network, session, user-agent, locale, client-time, referrer,
    coordinate, and adapter-identity exclusions machine-readable.
  - Replaced token-based npm publication with a two-phase exact-main OIDC workflow, immutable tarball/SBOM hand-off, isolated pull-request validation, and fail-closed integrity checks.
  - Added fail-closed source and npm-package admission for the administrative contributor registry and pinned the CI/CD runtime to Node.js 24.18.0 LTS.
  - (placeholder)

## [0.2.9] - 2026-07-13

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)
  - Consume the RFC-remediated `@plasius/translations` release (task #39).

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.2.8] - 2026-07-02

- **Added**
  - (placeholder)

- **Changed**
  - Deprecated legacy MCP admin env-name constants while preserving source compatibility; rollout action contracts continue to use stored feature-flag identifiers.

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.2.7] - 2026-06-30

- **Added**
  - Governed asset catalog, source, pipeline, and review MCP discovery
    descriptors for the hosted Plasius backend MCP surface.

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.2.6] - 2026-06-28

- **Added**
  - (placeholder)

- **Changed**
  - Refreshed development dependency baselines to `@types/node@25.9.4`, `@typescript-eslint/*@8.62.0`, and `eslint@10.6.0` while keeping Node typings aligned with the supported Node 24 runtime line.

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.2.5] - 2026-06-22

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.2.4] - 2026-06-22

- Added `en-GB` translation keys/defaults for MCP admin action,
  verification, and manifest descriptions.
- Added `descriptionKey` and `descriptionDefault` metadata to MCP action and
  verification descriptors while preserving existing `description` values.
- Restored the package CD workflow so protected main releases are prepared by PR
  and published without direct branch pushes.
- Restored the repo governance companion files (`WORKFLOW.md`,
  `FLAGS_AND_CAPABILITIES.md`, and `NFR.md`) and linked them from the README.
- Updated the published MCP admin contract package to the current v3 site
  registry, including tuple-based capability descriptors plus bounded
  analytics and user-aggregation whitelist surfaces.
- Added governance baseline companion docs to restore missing repository
  requirements (`NFR.md`, `WORKFLOW.md`, and `FLAGS_AND_CAPABILITIES.md`).
- Removed private repository issue references from public governance docs.


[0.2.4]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.2.4
[0.2.5]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.2.5
[0.2.6]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.2.6
[0.2.7]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.2.7
[0.2.8]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.2.8
[0.2.9]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.2.9
