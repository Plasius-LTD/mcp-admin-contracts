# ADR 0004: Owner Token adjustment MCP boundary

- Status: Accepted
- Date: 2026-08-01

## Context

Platform owners need to inspect a user's Token wallet and propose support
credits through either User Admin or MCP. A direct balance setter would bypass
the authoritative economy journal, make concurrent mutations unsafe, and make
operator actions difficult to prove. MCP discovery must also remain public-safe
metadata rather than acquiring authentication, persistence, or ledger logic.

## Decision

Add an `economyAdjustments` MCP action family containing bounded wallet and
activity reads, adjustment listing, positive-credit proposal, approval,
rejection, and compensating reversal. Every action declares its rollout flag,
finance capability, and required MCP token scopes.

Mutation descriptors model preview-bound proposals. The runtime must require a
different stable platform-owner account to approve a proposal before the
authoritative ledger is changed. A reversal is another proposal and an
immutable compensating transaction. There is no set-balance, patch-balance, or
delete action.

Exact TokenSubunit values cross the contract as base-10 strings. The server
resolves the permitted personal wallet from the supplied account ID; clients
cannot supply an authoritative wallet ID. Raw idempotency keys and ticket
references may be sent to the trusted runtime but must be domain-separated and
fingerprinted before authoritative persistence.

## Consequences

- MCP and User Admin can share one governed runtime command path.
- Hosts retain responsibility for platform-owner authentication, step-up,
  capability checks, dual control, transactional persistence, and auditing.
- The public contract remains provider-neutral and contains no payment data or
  production identifiers.
- Correcting a credit adds evidence and a compensating fact; it never rewrites
  or deletes history.
