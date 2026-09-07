# @plasius/mcp-admin-contracts

[![npm version](https://img.shields.io/npm/v/@plasius/mcp-admin-contracts.svg)](https://www.npmjs.com/package/@plasius/mcp-admin-contracts)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Plasius-LTD/mcp-admin-contracts/ci.yml?branch=main&label=build&style=flat)](https://github.com/Plasius-LTD/mcp-admin-contracts/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/Plasius-LTD/mcp-admin-contracts)](https://codecov.io/gh/Plasius-LTD/mcp-admin-contracts)
[![License](https://img.shields.io/github/license/Plasius-LTD/mcp-admin-contracts)](./LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-yes-blue.svg)](./CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/security%20policy-yes-orange.svg)](./SECURITY.md)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](./CHANGELOG.md)

Public-safe MCP admin discovery contract descriptors and response builders for
the live Plasius MCP admin surface.

## Boundary

This package contains contract metadata only:

- MCP action descriptors
- MCP schema/context/discovery response builders
- AI plugin manifest builder
- rollout flag identifiers used by the contract
- deprecated legacy env-name constants retained for source compatibility only
- analytics and bounded user-aggregation whitelist constants
- public-safe pseudonymous Token activity/trend metadata
- TypeScript types for these payloads

It intentionally does not contain runtime enforcement:

- no authentication or session logic
- no authorization checks
- no persistence or data clients
- no audit writers
- no mutation execution
- no environment reads
- no production data

Consumers must continue to enforce authentication, authorization, rollout gates,
rate limits, audit logging, and input validation in their own runtime boundary.
Stored feature flags are the rollout source of truth; exported `*_ENV_VAR`
constants are legacy compatibility names and must not be used as production
runtime controls.

## Install

```bash
npm install @plasius/mcp-admin-contracts
```

## Usage

```ts
import {
  buildMcpDiscoveryResponse,
  buildMcpSchemaResponse,
  buildMcpContextResponse,
  MCP_ADMIN_ANALYTICS_METRICS,
} from "@plasius/mcp-admin-contracts";
```

The exported registry currently covers:

- feature-flag MCP adapters
- capability-rule and effective-capability descriptors keyed by canonical tuple identities
- bounded analytics queries and curated analytics presets
- bounded grouped user-aggregation summaries without raw per-user export
- privacy-safe feedback intelligence for immutable bug-health and satisfaction
  reports, deterministic alerts, processor freshness, and
  reporter-identifier-free structured entries and safe in-game reconstruction
  manifests
- read-only global Token overview, pseudonymous wallet/activity, and bounded
  spend-trend descriptors
- governed asset catalog, source-intake, pipeline, and review descriptors for
  the hosted `plasius-ltd-site` MCP backend
- canonical model-resolution discovery sourced from `@plasius/asset-mcp`,
  including its authenticated `mcp://models/...` resource templates
- owner-only Token finance descriptors for bounded wallet/activity reads and
  dual-approved credit or compensating-reversal workflows

### Canonical model resolution

The additive `modelTools` discovery family advertises the eight exact MCP
tool names owned by `@plasius/asset-mcp 0.1.7`:

- `list_model_search_rankers`
- `search_model_catalog`
- `resolve_model_request`
- `get_model_resolution`
- `confirm_model_candidate`
- `retry_model_resolution`
- `cancel_model_resolution`
- `rebuild_model_catalog_index`

These are JSON-RPC 2.0 tools executed with `tools/call` over `POST /api/mcp`.
They are deliberately separate from the existing REST-backed `actions` array;
all legacy descriptors and exports remain source-compatible. The schema
response references the canonical input/output schema objects, annotations,
OAuth security schemes, capabilities, review-result metadata, and rollout
metadata directly from `@plasius/asset-mcp` rather than maintaining local
copies. The `resolve_model_request` schema includes the canonical ChatGPT file
parameter, paired rights attestation, PVOX result metadata, and fail-closed
rollout controls from that source package. Each wrapper also carries bounded
verification notes identifying the
canonical result or follow-up tool used to confirm an operation.

Every model tool requires the parent
`asset.pipeline.unified-ai-assets.enabled` flag. Provider acquisition and the
future generator additionally carry the conditional, fail-closed
`asset.pipeline.external-model-harvest.enabled` and
`asset.pipeline.ai-model-generation.enabled` flags only on the tools that may
attempt those fallbacks. PVOX-producing paths additionally carry
`asset.pipeline.pvox-models.enabled`. Installing this package does not evaluate
any flag or make a hosted tool callable; the consuming runtime owns fail-closed
rollout, OAuth, capability, ownership, and audit enforcement.

Tool scopes and capabilities are preserved exactly, including distinct
`asset.catalog.request`, `asset.catalog.confirm`, and operator-only
`asset.pipeline.mcp.manage` requirements. The wider model capability registry
also carries `asset.catalog.review` and `asset.source.manage` for coordinated
host discovery. `MCP_ADMIN_MODEL_OAUTH_SCOPES` is the complete issuer and
protected-resource scope registry (`mcp:access` plus all five asset capability
scopes); it does not broaden any individual tool descriptor. Named
`MCP_ASSET_*_CAPABILITY` exports, including
`MCP_ASSET_CATALOG_CONFIRM_CAPABILITY`, use the canonical package constants so
hosts do not need to hardcode those identifiers. Authenticated
model-resolution records, processing manifests,
1024-pixel originals, and promoted manifests are advertised through the five
canonical `mcp://models/...` resource templates. Inline 512-pixel four-view
image results remain part of the canonical tool result contract, not this
admin wrapper.

Shared verification-note arrays and the exported context schema are deeply
frozen. A consumer therefore cannot mutate one discovery or schema result and
silently change later calls in the same process.

Package-owned en-GB keys provide stable descriptions for every canonical tool.
When discovery is built, description drift between those translations and the
pinned canonical registry fails closed. `@plasius/asset-contracts 0.4.0`
supplies the underlying model-resolution contract version; no model schema is
redeclared here.

Token finance descriptors require the host to enforce the parent
`economy.tokens.enabled` flag and the package-published
`mcp.admin-economy-adjustments.enabled` flag. They declare the relevant
`economy.finance-operations.*` capability and OAuth resource scopes. The
contract intentionally has no balance-setter or Token delete action: credits
and reversals are immutable, preview-bound proposals that require a distinct
owner approval in the runtime authority.

### Admin Token reporting

The Token descriptors require the `mcp:access` OAuth scope, the
`admin.economy.read` and `economy.finance-operations.view` capabilities, and
both stored flags:

- `economy.admin-history.enabled`
- `mcp.admin-economy-history.enabled`

The global overview is an identifier-free point-read shape with exact balance
and lifetime totals, wallet counts, projection time, and canonical authority
sequence. Wallet balance pages are capped at 100 rows and expose only separate
MCP-audience wallet/subject aliases, closed component/status codes, exact
amounts, update time, and projection sequence.

Activity pages default to 30 days, allow at most 365 days and 100 rows, and
return only normalized source groupings, exact signed TokenSubunits,
source-owned safe labels, and versioned MCP-audience row/subject aliases. Raw
account, wallet, transaction, order, payment, provider-event, idempotency, and
journal-integrity identifiers are outside the contract.

Trend cohorts below five distinct subjects are suppressed without counts or
amounts. Reported points may include an explainable 28-window median/MAD
advisory. All four reporting tools are read-only and MCP has no
identity-resolution action.

These descriptors remain `near-future` until the hosted site registers the
JSON-RPC tools and passes scope/capability/flag, bounded-output, privacy, and
audit integration tests. Installing or publishing this package does not create
runtime routes.

### Feedback intelligence

The read-only `feedback` domain publishes these near-future hosted action
contracts:

- `getFeedbackBugHealth`
- `getFeedbackSatisfaction`
- `listFeedbackAlerts`
- `getFeedbackFreshness`
- `listFeedbackStructuredEntries`
- `getFeedbackGameReconstruction`

Every feedback descriptor carries the canonical default-off rollout flag
`feedback.mcp.enabled`, required capability `admin.feedback.read`, complete
action-level OAuth scopes `mcp:access` plus `admin.feedback.read`, and a
machine-readable privacy boundary. The same controls are repeated in the
descriptor's unified read-only `access` metadata so a consumer cannot silently
drop one requirement when building hosted tools. The consuming admin/MCP
runtime owns evaluation of those controls and must fail closed. When the flag,
scope, or capability is unavailable, the consumer-visible fallback is that the
feedback actions are omitted or rejected; this package does not evaluate
access.

`MCP_ADMIN_FEEDBACK_HOST_DEFAULT_ENABLED` is exported as `false` so host
registries can verify the intended initial state without treating this public
metadata package as a runtime flag evaluator.

The global AI-plugin manifest deliberately retains its existing
`openid email profile mcp:access` base scopes. The feedback scopes remain
action metadata until the site OAuth issuer, protected-resource metadata, and
staged rollout are coordinated.

Feedback reads use closed server-owned windows, opaque continuation cursors of
at most 512 characters, and pages of at most 100 records. They address
immutable materialised reports and schema-validated structured projections,
never unrestricted storage scans. Every feedback-specific object projection
also declares `additionalProperties: false`, keeping undeclared fields outside
the Admin/MCP serialization boundary.

The structured-entry action accepts one required `filters` object. It is an
exact `packetType`-discriminated union: the bug variant alone permits
`surfaceId`, `buildId`, and `severity`, while the review variant alone permits
`satisfaction`. Both variants contain the bounded window, limit, and cursor.
Consumers must reject unknown or cross-packet fields before flattening the
selected variant into route query parameters.

The reconstruction action is an exact point read by lowercase UUIDv4 bug
packet ID. It returns only the canonical
`FeedbackGameReconstructionManifestSchema`: opaque content IDs, server-owned
creation and expiry times, an allowlisted curated public asset-set ID, a
translation notice key, and consented coarse renderer diagnostics. It has no
list, search, cursor, free-form query, or mutation variant. The manifest is
clearly labelled as a server-side reconstruction and is not a literal
screenshot. It contains no captured pixels, binary image, narrative, DOM,
reporter/control identity, request telemetry, URL, storage locator, arbitrary
asset, or direct Blob reference. Hosts must return the same not-found response
for absent, expired, and unavailable manifests to avoid adding a richer
existence oracle.

This package directly consumes the published `@plasius/schema ^1.4.3`
dependency. Packet and report descriptors bind their schema sources to its
feedback contract version `1.0.0`, and their vocabularies and schema identity
metadata are imported from that package at runtime. Entries are discriminated
by the canonical
`feedback-bug-packet`/`feedback-review-packet` identities; hourly bug-health,
daily satisfaction, advisories, diagnostics, processor checkpoints, and safe
reconstruction manifests use the same closed kebab-case vocabulary and
lowercase UUIDv4 constraints as the canonical schemas. The registry-generated
lock resolves the package directly; source, file, and Git dependency pins
remain prohibited.

The contracts explicitly exclude account, reporter, network, session,
user-agent, locale, client-time, referrer, coordinate, dimension, and adapter
identifiers; credentials and secrets; financial and government identifiers;
filenames and raw warnings; narrative, binary images, client pixels, request
telemetry, Blob references, raw URLs, unrestricted scans, and mutations.
Narrative-derived data is limited to closed classifications; it cannot include
summaries, quotations, embeddings, hashes, matched values, or model traces.
Renderer diagnostics are bounded structured facts only and never
user-captured pixels.

Action descriptors keep their existing `description` field and also expose
`descriptionKey` and `descriptionDefault` so clients can resolve display text
through `@plasius/translations`:

```ts
import { createI18n } from "@plasius/translations";
import {
  buildMcpDiscoveryResponse,
  mcpAdminContractsTranslations,
} from "@plasius/mcp-admin-contracts";

const i18n = createI18n({
  language: "en-GB",
  fallback: "en-GB",
  translations: mcpAdminContractsTranslations,
});
const [action] = buildMcpDiscoveryResponse().actions;

console.log(i18n.t(action.descriptionKey));
```

## Local Development

```bash
npm install
npm run build
npm test
npm run pack:check
```

`pack:check` blocks accidental private runtime imports, environment reads, and
runtime path leakage before publishing.

## Governance

- Agent boundary: [`AGENTS.md`](./AGENTS.md)
- Delivery workflow: [`WORKFLOW.md`](./WORKFLOW.md)
- Rollout controls: [`FLAGS_AND_CAPABILITIES.md`](./FLAGS_AND_CAPABILITIES.md)
- Non-functional requirements: [`NFR.md`](./NFR.md)
- Security policy: [`SECURITY.md`](./SECURITY.md)
- Code of conduct: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- ADRs: [`docs/adrs`](./docs/adrs)
- CLA and legal docs: [`legal`](./legal)

For `Plasius-LTD/mcp-admin-contracts#12`, the parent hardening flag
`repo-review.2026-05-17.hardening.enabled` is runtime `N/A` because restoring
these governance files does not change package behavior.

## License

Apache-2.0

<!-- BEGIN PLASIUS RELEASE INTEGRITY -->
## Release integrity

CI keeps the administrative contributor registry outside Git and npm package
artifacts using exact, case-normalised path checks. CI accepts repository-owned
branch pushes only, using literal `[self-hosted, Linux, X64]` labels for every
job. External fork and pull-request events never execute on this capacity; a
maintainer must review and move a contribution to a repository-owned branch.
Scheduled dependency validation uses the same labels and is restricted to main. Release preparation and
publication use a two-run exact-main protocol on GitHub-hosted Node.js 24.18.0
LTS. A read-only job seals the package tarball and SBOM before a dependency-free
production job publishes that exact artifact through npm OIDC with provenance;
there is no npm write-token fallback. CD remains disabled until the npm trusted
publisher binding and protected-branch-only production environment are
independently verified. Release preparation continues only after observing the
metadata PR as `MERGED`; a queued merge request is insufficient. Closed PRs,
unreadable or unexpected states, and the bounded timeout stop publication.

For restricted runner groups, review and lock each implementation or generated
release branch with administrator enforcement before admitting its exact
workflow branch ref. Preserve required checks and remove temporary admission
after merge. Allocate a fresh pipeline-owned version; never reuse removed npm
versions. The inherited `platform.public-artifact-integrity.enabled` flag
controls restoration, while mandatory integrity checks cannot be bypassed.
Rollback disables `cd.yml` without restoring administrative files or npm tokens.
See [ADR 0008](docs/adrs/adr-0008-trusted-ci-and-confirmed-release-merges.md).
<!-- END PLASIUS RELEASE INTEGRITY -->
