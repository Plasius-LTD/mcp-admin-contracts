# AGENTS.md

## Scope

This package owns public-safe MCP admin discovery contracts only.

## Boundary Rules

- Keep this package free of runtime data access, authentication, authorization,
  audit writing, Azure bindings, environment reads, and mutation execution.
- Do not add private data, secrets, local settings, production payloads, or
  service-specific persistence code.
- New exports must remain contract metadata, pure response builders, or types.
- Update tests, README, CHANGELOG, and ADRs for contract-shape changes.
- Run `npm test`, `npm run build`, and `npm run pack:check` after changes.
