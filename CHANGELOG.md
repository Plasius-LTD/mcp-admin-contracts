# Changelog

## Unreleased

- **Added**
  - Added public-safe, read-only `list_admin_token_activity` and
    `get_admin_token_trends` descriptors with bounded pseudonymous activity,
    privacy-suppressed trends, and explainable anomaly metadata.

- **Changed**
  - Advanced the additive MCP Admin registry contract to `2026-07-18.v4` and
    exposed action-level OAuth scope, capability, rollout, read-only, and
    identity-resolution metadata.

- **Fixed**
  - (placeholder)

- **Security**
  - Token reporting contracts exclude raw financial/identity identifiers,
    provider-specific sources, small-cohort values, identity resolution, and
    mutation actions.

## [0.3.1] - 2026-08-01

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - Made release-preparation merge retries independent of repository auto-merge so required checks can settle without enabling repository-wide auto-merge.
  - Prevented the immutable publication bundle check from treating grep's
    expected early exit as a tar failure under `pipefail`.
  - Made npm publication consume the immutable tarball as an explicit local
    path instead of allowing npm to parse it as a Git dependency specifier.
  - Prevented release preparation from reusing an unpublished package version
    when its existing immutable tag points behind current main; the workflow
    now cuts the requested next version instead.

- **Security**
  - (placeholder)

## [0.3.0] - 2026-08-01

- **Added**
  - Added owner-only Token wallet/activity reads and dual-approved credit,
    rejection, and compensating-reversal MCP descriptors, including explicit
    finance capabilities and OAuth resource scopes (task #51).

- **Changed**
  - Advanced the additive MCP contract to `2026-04-28.v4` so discovery clients
    can identify the governed Token adjustment family.

- **Fixed**
  - (placeholder)

- **Security**
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
[0.3.0]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.3.0
[0.3.1]: https://github.com/Plasius-LTD/mcp-admin-contracts/releases/tag/v0.3.1
