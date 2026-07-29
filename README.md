# @plasius/mcp-admin-contracts

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
  reporter-identifier-free structured entries
- governed asset catalog, source-intake, pipeline, and review descriptors for
  the hosted `plasius-ltd-site` MCP backend

### Feedback intelligence

The read-only `feedback` domain publishes these near-future hosted action
contracts:

- `getFeedbackBugHealth`
- `getFeedbackSatisfaction`
- `listFeedbackAlerts`
- `getFeedbackFreshness`
- `listFeedbackStructuredEntries`

Every feedback descriptor carries the canonical default-off rollout flag
`feedback.mcp.enabled`, required capability `admin.feedback.read`, complete
action-level OAuth scopes `mcp:access` plus `admin.feedback.read`, and a
machine-readable privacy boundary. The consuming admin/MCP runtime owns
evaluation of those controls and must fail closed. When the flag or capability
is unavailable, the consumer-visible fallback is that the feedback actions are
omitted or rejected; this package does not evaluate access.

The global AI-plugin manifest deliberately retains its existing
`openid email profile` base scopes. The feedback scopes remain action metadata
until the site OAuth issuer, protected-resource metadata, and staged rollout
are coordinated.

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

Packet and report descriptors currently use a pinned, source-hashed projection
of the staged `@plasius/schema` feedback contract `1.0.0`; this package does
not yet directly import or depend on `@plasius/schema`. Entries are
discriminated by the canonical
`feedback-bug-packet`/`feedback-review-packet` identities; hourly bug-health,
daily satisfaction, advisories, diagnostics, and processor checkpoints use
the same closed kebab-case vocabulary and UUIDv4 constraints as the pinned
schema source.

Publishing this feedback contract remains blocked until a released
`@plasius/schema` version satisfying `^1.4.0` is available and consumed
directly through the approved dependency and lockfile workflow. Do not add an
unpublished semver or release this source-projected form.

The contracts explicitly exclude account, reporter, network, session,
user-agent, locale, client-time, referrer, coordinate, and adapter identifiers;
they also exclude narrative, binary images, Blob references, raw URLs,
unrestricted scans, and mutations.
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
artifacts using exact, case-normalised path checks. External fork heads are
rejected; same-repository pull requests validate on GitHub-hosted runners and
main pushes validate on approved self-hosted runners. Release preparation and
publication use a two-run exact-main protocol on GitHub-hosted Node.js 24.18.0
LTS. A read-only job seals the package tarball and SBOM before a dependency-free
production job publishes that exact artifact through npm OIDC with provenance;
there is no npm write-token fallback. CD remains disabled until the npm trusted
publisher binding and protected-branch-only production environment are
independently verified.
<!-- END PLASIUS RELEASE INTEGRITY -->
