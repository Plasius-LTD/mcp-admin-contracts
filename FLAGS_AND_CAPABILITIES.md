# FLAGS_AND_CAPABILITIES.md

## 1. Purpose

This document defines rollout and access governance expectations for Features
implemented from this repository.

## 2. Feature-Flag Baseline

- All parent feature work must reference a remotely controllable feature flag.
- This repository’s current hardening slice is tracked under:
  `platform.repo-hardening-sweep.enabled`.

## 3. Capability Rules

- Add capability contracts only when user-facing entitlement, visibility, or access
  control is introduced.
- Contract-only schema/baseline governance work does not require new capabilities
  by itself.

## 4. Rollout Completion Rule

- A task should not be marked complete until the parent feature flag behavior and
  rollback expectations are documented in the feature task evidence.
- Capabilities and flags inherit from the parent feature unless explicitly
  documented otherwise.
