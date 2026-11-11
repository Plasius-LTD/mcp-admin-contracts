# ADR-0009: Opt in to feedback review discovery without widening existing grants

- Status: Accepted
- Date: 2026-11-11
- Work: [MCP contracts #79](https://github.com/Plasius-LTD/mcp-admin-contracts/issues/79)

## Context

The legacy feedback registry is read-only. Publishing new write descriptors
into its default discovery or global OAuth manifest would let older hosts
describe actions before they implement the protected grant, flags, auditing
and command checks. Existing feedback reporting and reconstruction tools
also have separate activation and must not be advertised as a side effect.

## Decision

Export a separate immutable registry of five tool descriptors. Both MCP
surfaces explicitly consume this registry. The workflow schema version and
closed vocabularies come from the published `@plasius/schema` 1.5.0. The
package describes the narrow queue, point read, and actor-free write result;
it does not execute or authenticate them. No existing descriptor, discovery
response, OAuth default or tool registration changes.

The consuming site is the source-of-truth evaluator. Read tools require the
existing `admin.feedback.read` capability and scope, `mcp:access`,
`feedback.mcp.enabled` and `feedback.review-workflow.enabled`. Mutation tools
add the protected `admin.feedback.manage` capability and scope, and
`feedback.processing.enabled`. Require all gates on discovery and execution,
including existing transport read/write switches and owner/admin checks.
Unknown or unavailable grants, flags or routes fail closed. There are no
environment overrides. Both new rollout flags default off. Disable processing
to keep reads/history available; disable the workflow to remove all five tools.

Tools bind action literals to explicit human direction for an identified
packet. A write is idempotent only when the same revision, packet, key and
command are replayed. Conflicts require fresh user direction. No action
deletes or edits source packets, resolves actor identities or calls external
systems. Use the closed public schema projections for output; history,
filters and freshness never expose audit links or store metadata.

## Consequences

Existing read-only grants and consumers stay compatible. Both hosts must
coordinate their discovery, authorization, bounded execution and release
checks in the site integration task. Package tests verify names, gates,
translations, annotations, canonical schema references, payload closure,
and unchanged legacy discovery. Publish through protected main and
production CD before site consumption.
