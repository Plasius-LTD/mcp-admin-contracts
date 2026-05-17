# NFR.md

## 1. Purpose

This file defines the non-functional baseline for `@plasius/mcp-admin-contracts`.
Because this package is distributed publicly and consumed by runtime systems,
its contract surface must remain safe, stable, testable, and free of private
runtime behavior.

## 2. Security

Priority: Critical

Generated or edited code in this package must:

- avoid secrets, tokens, credentials, private payload samples, or production identifiers
- avoid network calls, environment reads, filesystem access, or hidden side effects
- keep exports limited to types, constants, schema metadata, and pure response builders
- validate any generated contract structures before publishing

## 3. Privacy

Priority: Critical

This package must stay public-safe:

- no personal data fixtures unless explicitly anonymized and necessary for tests
- no contract examples that disclose sensitive operational fields
- no runtime data access or persistence code

## 4. Reliability

Priority: High

Changes must preserve:

- deterministic pure-function behavior
- stable module entrypoints and package exports
- clear failure modes for invalid builder inputs
- backward-compatible public contract behavior unless an intentional breaking change is documented

## 5. Performance

Priority: High

This package should remain lightweight at the boundary:

- avoid unnecessary bundle or parse cost in the common import path
- prefer tree-shakeable exports and side-effect-free modules
- do not add heavy transitive dependencies without clear justification

## 6. Maintainability

Priority: High

Every change should:

- respect the package boundary described in `AGENTS.md`
- update README, ADRs, and changelog when public expectations change
- keep the published package layout valid under `npm pack`
- include tests for changed public behavior

## 7. Validation Baseline

Required local validation after changes:

- `npm test`
- `npm run build`
- `npm run pack:check`

Use CI confirmation as an additional completion gate when available.
