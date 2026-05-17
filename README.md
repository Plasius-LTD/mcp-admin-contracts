# @plasius/mcp-admin-contracts

Public-safe MCP admin discovery contract descriptors and response builders for
the live Plasius MCP admin surface.

## Boundary

This package contains contract metadata only:

- MCP action descriptors
- MCP schema/context/discovery response builders
- AI plugin manifest builder
- rollout flag identifiers used by the contract
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
