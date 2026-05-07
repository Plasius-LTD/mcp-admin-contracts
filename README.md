# @plasius/mcp-admin-contracts

Public-safe MCP admin discovery contract descriptors and response builders.

## Boundary

This package contains contract metadata only:

- MCP action descriptors
- MCP schema/context/discovery response builders
- AI plugin manifest builder
- rollout flag identifiers used by the contract
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
} from "@plasius/mcp-admin-contracts";
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

- Security policy: [`SECURITY.md`](./SECURITY.md)
- Code of conduct: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- ADRs: [`docs/adrs`](./docs/adrs)
- CLA and legal docs: [`legal`](./legal)

## License

Apache-2.0
