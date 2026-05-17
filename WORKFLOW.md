# WORKFLOW.md

## 1. Purpose

This file defines the default delivery workflow for `@plasius/mcp-admin-contracts`.
Use it together with `AGENTS.md`, `FLAGS_AND_CAPABILITIES.md`, and `NFR.md`
when implementing tracked work in this repository.

## 2. Default Rule

- Use the heavy-weight workflow for tracked features, stories, tasks, package
  changes, API/contract changes, release-bearing docs, and architecture work.
- Only narrow non-semantic edits may use the trivial-edit exception.

## 3. Work Definition Order

1. Confirm the controlling GitHub issue and parent feature.
2. Assign the active repo issue to the current owner before implementation.
3. Move the active work item to `In Progress` when the relevant board supports it.
4. Record the parent feature flag in the issue, ADR, or implementation note.
5. For contract-surface changes, update ADRs and README usage guidance before
   marking the work complete.

## 4. Execution Loop

For each tracked task or story:

1. Read the acceptance criteria and package boundary rules.
2. Derive validation from the public contract and regression risk.
3. Implement the change without widening the runtime boundary.
4. Update tests and documentation together with the change.
5. Run the required local validation:
   - `npm test`
   - `npm run build`
   - `npm run pack:check`
6. Iterate until the required validation passes.
7. Update `CHANGELOG.md` under `Unreleased` unless the change is clearly
   internal and non-behavioral with an explicit reason recorded in the task.

## 5. Completion Gates

Do not mark work complete until:

- acceptance criteria are satisfied
- package boundary rules still hold
- tests/build/package validation are green
- required docs/ADR updates are present
- CI has succeeded when the repo workflow is available

## 6. Trivial-Edit Exception

The trivial-edit exception is intentionally narrow.

Allowed examples:

- spelling or grammar corrections
- formatting-only changes
- comment wording fixes
- document-only edits that do not change requirements, architecture, or release obligations

The exception does not apply to:

- tracked feature/task implementation
- public API or contract changes
- test changes
- package metadata changes
- documentation changes that alter package guarantees or workflow expectations

## 7. Relationship to Other Governance

- `AGENTS.md` defines the package boundary.
- `FLAGS_AND_CAPABILITIES.md` governs rollout metadata carried by this package.
- `NFR.md` defines the non-functional baseline for public contract work.
