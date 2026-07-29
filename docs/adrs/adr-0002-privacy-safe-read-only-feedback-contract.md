# ADR 0002: Privacy-Safe Read-Only Feedback Contract

## Status

Accepted

## Context

The admin dashboard and hosted MCP surface need a shared view of hourly bug
health, daily satisfaction, deterministic advisories, processor freshness, and
bounded structured feedback entries. The package is publicly published and
must not acquire runtime access to feedback packets, reporter-control state,
authentication, or storage.

Feedback narrative can contain personal or sensitive information even after
automated redaction. Reporter correlation is also pseudonymous personal data.
Neither belongs in this public contract or in the Admin/MCP response surface.
Unbounded report queries would additionally create an avoidable
denial-of-service and data-exfiltration surface.

## Decision

Add an additive `feedback` action family in contract version
`2026-07-29.v4`. It contains five read-only descriptors:

- hourly bug-health materialisations
- daily satisfaction materialisations
- deterministic feedback advisories
- report-processor freshness
- bounded reporter-identifier-free structured entries

All actions use `GET`, closed server-owned lookback windows, allowlisted
filters, opaque cursors of at most 512 characters, and pages of at most 100
records. Responses describe immutable materialised reports or bounded
schema-validated projections; no descriptor represents unrestricted packet,
Blob, or report scans. Every feedback-specific object projection rejects
additional properties so an undeclared field cannot be serialized across the
Admin/MCP contract boundary.

The structured-entry action models its complete `filters` object as an exact
union discriminated by `packetType`. The bug variant permits only its shared
window/paging controls plus `surfaceId`, `buildId`, and `severity`; the review
variant permits only the shared controls plus `satisfaction`. Both variants
disallow additional properties. Consuming runtimes must validate exactly one
variant, reject unknown and cross-packet fields, and only then map the selected
variant to route query parameters.

Every feedback descriptor carries:

- parent rollout flag `feedback.mcp.enabled`
- required capability `admin.feedback.read`
- complete action-level OAuth scopes `mcp:access` and `admin.feedback.read`
- a `public-safe-structured-only` privacy classification
- explicit exclusion of reporter pseudonyms, narrative, binary images, Blob
  references, raw URLs, unrestricted scans, and mutations

Narrative-derived outputs are limited to closed sentiment, intent, and
confidence buckets. Summaries, quotations, embeddings, hashes, matched values,
and model traces are forbidden. In-game evidence is represented only by
bounded renderer-owned diagnostic facts; captured pixels are not represented.

This package remains metadata and pure builders only. The consuming runtime
must enforce admin authentication, the capability and OAuth scope, the
default-off rollout flag, bounded parsing, fail-closed rate limits, and
dedicated audit. It must omit or reject the feedback tools when a control
cannot be evaluated.

The global AI-plugin manifest retains the existing `openid email profile`
base scopes. Publishing `admin.feedback.read` there before the site issuer,
protected-resource metadata, and staged rollout are coordinated would alter
authentication for unrelated tools while the feedback flag is off.

Persisted entry projections are discriminated by the exact
`feedback-bug-packet` and `feedback-review-packet` identities. Reports,
advisories, game diagnostics, and processor checkpoints currently use a
pinned, source-hashed projection of the staged `@plasius/schema` feedback
contract `1.0.0`, including exact kebab-case closed values and lowercase UUIDv4
constraints. This package does not yet directly import or depend on
`@plasius/schema`. The pinned parity fixture, transcribed from canonical schema
source revision `172d993e0f9dc951716dc2ce46a753232c2ad1f7`, prevents this
package from establishing a second feedback dialect while the corresponding
package release is staged.

Release of this feedback contract is blocked until a published
`@plasius/schema` version satisfying `^1.4.0` can be consumed directly through
the approved dependency and lockfile workflow. An unpublished semver must not
be added to the manifest or lockfile.

## Consequences

- Admin and hosted MCP consumers share one stable, public-safe feedback
  contract.
- Public package consumers can inspect exact privacy and query bounds without
  gaining access to runtime data or storage.
- Existing consumers must recognise contract version `2026-07-29.v4` and
  configure both `mcp:access` and `admin.feedback.read` before enabling the
  feedback family.
- This package must not release the feedback family from the pinned projection;
  direct consumption of released `@plasius/schema ^1.4.0` remains a release
  blocker.
- Runtime ingestion, storage, authorisation, reporting, audit, and mutation
  workflows remain outside this package.
