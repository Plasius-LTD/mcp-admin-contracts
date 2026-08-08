# ADR 0002: Read-Only Pseudonymous Token Reporting Tools

## Status

Accepted

## Context

Finance operators need MCP access to the same global balance/lifetime,
pseudonymous wallet/activity, and trend surface as the touch-first Admin
workspace. Routine reporting must not expose
raw account, wallet, transaction, order, payment, provider-event, idempotency,
or journal-integrity identifiers. MCP must not gain a pseudonym-resolution or
financial-mutation path.

This public package owns discovery metadata only. It cannot register JSON-RPC
tools, inspect an OAuth principal, evaluate stored flags or capabilities, query
the reporting projection, generate HMAC aliases, emit audit records, or set
HTTP cache controls.

## Decision

- Add the exact tool names `get_admin_token_economy_overview`,
  `list_admin_token_wallet_balances`, `list_admin_token_activity`, and
  `get_admin_token_trends` under the `economy` action domain.
- The overview contains only exact identifier-free aggregate balance/lifetime
  totals, wallet counts, and projection freshness. Wallet pages contain only
  separate MCP-audience wallet/subject aliases, closed component/status codes,
  exact non-negative amounts, and canonical authority sequence.
- Publish `mcp:access` as the required OAuth scope metadata and require both
  `admin.economy.read` and `economy.finance-operations.view` capabilities.
- Require both stored rollout flags: `economy.admin-history.enabled` and
  `mcp.admin-economy-history.enabled`.
- Mark both operations read-only and make identity resolution unavailable.
- Describe a default 30-day and maximum 365-day interactive window, a 100-row
  activity page, provider-neutral source filters, opaque cursors, and
  pseudonymous aliases.
- Describe hourly/daily trends, suppression below five distinct subjects, and
  advisory 28-window same-time median/MAD indicators. Suppressed points omit
  counts, amounts, aliases, and anomaly details.
- Keep descriptors `near-future` until the hosted site registers and verifies
  the JSON-RPC tools. Publication of this package alone never claims that a
  callable route exists.
- Advance the additive registry contract identifier to `2026-08-08.v5`.

## Consequences

- MCP clients can discover one stable public-safe contract before the private
  runtime implementation is enabled.
- The hosted site must filter discovery and re-check scopes, capabilities, and
  both stored flags on every call; discovery metadata is not authorization.
- The hosted site remains responsible for query deadlines, rate limits,
  private/no-store responses, safe query-shape audit, least-privilege reporting
  access, and audience-separated alias generation.
- The owner-only identity-resolution operation remains outside MCP.
- After the site JSON-RPC registration and integration tests are green, a
  follow-up contract update may promote the execution source from
  `near-future-route` to `existing-route`.
