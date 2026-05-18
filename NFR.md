# Non-Functional Requirements for @plasius/mcp-admin-contracts

## 1. Purpose

This document defines the non-functional requirements (NFRs) for changes to the
`@plasius/mcp-admin-contracts` package. The package is a public-safe contract
surface only and must remain dependency-safe, deterministic, and low-risk for
release automation.

## 2. Security

- Do not include secrets, credentials, local environment values, or runtime keys in
  any contract descriptors.
- Avoid adding executable runtime logic that could leak identity or authentication
  context.
- Preserve boundary isolation: discovery and contract builders must not perform
  auth, persistence, or audit side effects.

## 3. Reliability and Compatibility

- Contract exports must remain stable for existing callers except through
  documented SemVer changes.
- Keep shape changes additive where practical.
- Keep exported payloads serializable and free of runtime-local objects.
- Keep schema and payload tests aligned with public contract fixtures.

## 4. Build and Validation

- Changes must pass `npm run typecheck`, `npm run lint`, `npm run test`, and
  `npm run pack:check`.
- Any release-impacting change must keep `npm run test` and build outputs green
  under CI.

## 5. Rollout Controls

- All rollout-sensitive work that flows into feature delivery must remain
  associated with the parent Feature flag:
  `platform.repo-hardening-sweep.enabled`.
- Contract-only documentation and baseline governance changes are low-risk but must
  still be tracked under the parent feature.

## 6. Accessibility / Usability

- Public contract docs must explain payload shape, intended caller ownership, and
  operational assumptions clearly enough for downstream package consumers.
