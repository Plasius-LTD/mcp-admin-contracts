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
- read-only global Token overview, pseudonymous wallet/activity, and bounded
  spend-trend descriptors
- governed asset catalog, source-intake, pipeline, and review descriptors for
  the hosted `plasius-ltd-site` MCP backend
- owner-only Token finance descriptors for bounded wallet/activity reads and
  dual-approved credit or compensating-reversal workflows

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
