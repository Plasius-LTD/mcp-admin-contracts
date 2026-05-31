# Changelog

## Unreleased

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
