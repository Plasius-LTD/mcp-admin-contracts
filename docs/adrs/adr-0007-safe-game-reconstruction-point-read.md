# ADR 0007: Safe Game Reconstruction Point Read

## Status

Accepted

## Context

ADR 0005 established the public-safe, read-only feedback family for Admin and
hosted MCP consumers. Approved in-game surfaces may also produce consented,
coarse renderer diagnostics. Administrators need a way to inspect a
representative view assembled from those facts and curated public assets.

The result must not be mistaken for a user's screen. Returning captured
pixels, narrative, DOM, request telemetry, reporter-control state, arbitrary
asset references, or direct storage locations would cross the privacy boundary
and could expose personal data. A list or free-form search over reconstruction
records would also create an unnecessary probing and denial-of-service
surface.

## Decision

Advance the additive Admin registry contract to `2026-08-26.v8` and add one
near-future, read-only feedback action:

- `getFeedbackGameReconstruction`

The action maps to
`GET /api/admin/feedback/reconstructions/{bugPacketId}` and accepts exactly one
canonical lowercase UUIDv4 bug-packet ID. It has no list, search, cursor,
free-form query, arbitrary date range, or mutation form.

The output is one closed projection of the published
`@plasius/schema ^1.4.0`
`FeedbackGameReconstructionManifestSchema`. It contains only:

- canonical type and contract version;
- opaque reconstruction and source packet UUIDv4 values;
- server-owned creation and expiry times, with the canonical maximum 30-day
  lifetime;
- one bounded, allowlisted curated public asset-set identifier;
- one bounded translation notice key that labels the result as a
  reconstruction that is not a literal screenshot; and
- consented coarse renderer diagnostics using the canonical, closed generator
  or GPU demo provenance variants.

Every nested object rejects additional properties. Diagnostics use closed
renderer, backend, viewport, frame-rate, frame-time, feature, counter, and
stable error-code vocabularies with explicit collection bounds. The result
cannot express captured pixels, binary images, narrative, DOM, player or
reporter identity, correlation pseudonyms, request telemetry, URLs, filenames,
exact coordinates, adapter fingerprints, raw warnings, direct Blob references,
or arbitrary assets.

The descriptor carries the same complete fail-closed controls as every other
feedback read:

- default-off host rollout flag `feedback.mcp.enabled`;
- OAuth scopes `mcp:access` and `admin.feedback.read`;
- capability `admin.feedback.read`;
- read-only mode with no identity-resolution operation;
- bounded runtime rate limiting and dedicated audit; and
- uniform not-found behaviour for absent, expired, and unavailable manifests.

This package publishes metadata and pure response builders only. The hosted
site remains the authority for authentication, authorization, flag evaluation,
schema validation, safe reconstruction, retention, rate limiting, audit, and
uniform errors. Publishing the package does not create the route or enable the
feature.

## Consequences

- Admin and hosted MCP clients can discover the same schema-backed safe
  reconstruction point read without receiving an image or storage locator.
- Consumers must recognise contract version `2026-08-26.v8` before advertising
  the action.
- The hosted site must omit or reject the action whenever authentication,
  either OAuth scope, the capability, the rollout flag, rate limiting, or the
  canonical report projection is unavailable.
- Actual screenshots, attachments, unrestricted reconstruction scans, and all
  feedback mutations remain outside the v1 MCP feedback contract.
