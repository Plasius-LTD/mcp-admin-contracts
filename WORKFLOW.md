# WORKFLOW.md

## 1. Purpose

This file defines the default delivery process for implementation work in this
repo. It keeps contract updates traceable, test-backed, and release-ready.

## 2. Rules

- Use the heavy-weight workflow for feature, bug-fix, and contract-shape changes.
- Follow the tracked issue hierarchy from `plasius-ltd-site` epic/feature/story/task
  items.
- Assign the active implementation issue to the operator and keep it under
  progress until required checks pass.

## 3. Execution Loop

1. Confirm issue scope and acceptance criteria.
2. Update/author tests first when behavior is changing.
3. Implement code, tests, and docs together.
4. Run required validation for touched areas (`typecheck`, `lint`, `test`, 
   `pack:check`).
5. Update `CHANGELOG.md` and README references as required.
6. Push PR and confirm CI before marking story/task done.

## 4. Governance Linkage

- Parent feature for this batch: `Plasius-LTD/plasius-ltd-site#358`.
- Parent feature flag: `platform.repo-hardening-sweep.enabled`.
- Contract edits should not add runtime auth/persistence/audit behaviour.

## 5. Completion Gate

Do not mark work complete until required checks and project-task evidence are
recorded on the linked issue.
