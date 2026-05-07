# ADR 0001: Public-Safe MCP Admin Contract Package Boundary

## Status

Accepted

## Context

MCP admin discovery needs a stable contract that can be reused outside one
runtime without publishing private application data or privileged execution
logic.

## Decision

`@plasius/mcp-admin-contracts` contains only public-safe discovery metadata,
types, flag identifiers, and pure response builders. Runtime systems remain
responsible for session validation, authorization, rollout evaluation, rate
limits, audit emission, persistence, and mutation execution.

## Consequences

- The package can be published publicly because it has no data clients, no
  secrets, and no production payloads.
- Runtime systems can share the same MCP response contract without copying
  descriptors.
- Publishing this package does not grant access to any admin route or private
  data because the server-side runtime still enforces every privileged control.
