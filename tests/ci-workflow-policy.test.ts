import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const read = (path: string): string =>
  readFileSync(resolve(process.cwd(), path), "utf8");

const ciWorkflow = read(".github/workflows/ci.yml");
const cdWorkflow = read(".github/workflows/cd.yml");
const releasePrepareWorkflow = read(".github/workflows/release-prepare.yml");
const npmConfig = read(".npmrc");

describe("release workflow trust boundaries", () => {
  it("validates repository-owned pushes on explicit self-hosted capacity", () => {
    expect(ciWorkflow).toMatch(/push:\s*\n\s+branches: \["\*\*"\]/u);
    expect(ciWorkflow).not.toMatch(/^\s*(?:pull_request|pull_request_target):/mu);
    expect(ciWorkflow).not.toMatch(/ubuntu-latest|fromJSON|inputs\./u);
    expect(ciWorkflow.match(/runs-on: \[self-hosted, Linux, X64\]/gu)).toHaveLength(3);
    expect(ciWorkflow).toContain("name: Trusted head admission");
    expect(ciWorkflow).toContain("if: ${{ github.event_name == 'push' }}");
    expect(ciWorkflow.match(/needs: trusted_head/gu)).toHaveLength(2);
    expect(ciWorkflow.match(/actions\/checkout@v5/gu)).toHaveLength(2);
    expect(ciWorkflow.match(/actions\/setup-node@v6/gu)).toHaveLength(2);
    expect(ciWorkflow.match(/package-manager-cache: false/gu)).toHaveLength(2);
    expect(ciWorkflow).not.toMatch(/cache:.*npm/u);
    expect(ciWorkflow).toContain("timeout-minutes: 30");
  });

  it("bounds scheduled dependency validation to trusted main self-hosted capacity", () => {
    const auditWorkflow = read(".github/workflows/npm-audit-fix.yml");
    expect(auditWorkflow).toContain("runs-on: [self-hosted, Linux, X64]");
    expect(auditWorkflow).toContain("if: ${{ github.ref == 'refs/heads/main' }}");
    expect(auditWorkflow).toContain("timeout-minutes: 30");
    expect(auditWorkflow).toContain("package-manager-cache: false");
    expect(auditWorkflow).not.toMatch(/ubuntu-latest|pull_request_target:|^\s+pull_request:|cache: "npm"/mu);
  });

  it("binds a second publication run to the prepared main SHA and successful CI", () => {
    expect(cdWorkflow).toContain("- prepare");
    expect(cdWorkflow).toContain("- publish");
    expect(cdWorkflow).toContain("expected_commit_sha");
    expect(cdWorkflow).toContain('"ref": "main"');
    expect(cdWorkflow).toContain('"phase": "publish"');
    expect(cdWorkflow).toContain("actions/workflows/cd.yml/dispatches");
    expect(cdWorkflow).toContain('-f head_sha="${EXPECTED_SHA}"');
    expect(cdWorkflow).toContain("-f branch=main");
    expect(cdWorkflow).toContain("-f event=push");
    expect(cdWorkflow).toContain("refs/heads/main");
    expect(releasePrepareWorkflow).toContain("COMMIT_SHA=$(git rev-parse HEAD)");
  });

  it("uses supported phase-isolated concurrency", () => {
    expect(cdWorkflow).toContain(
      "group: npm-cd-${{ github.repository }}-${{ inputs.phase == 'publish'",
    );
    expect(cdWorkflow).toContain("inputs.expected_commit_sha");
    expect(cdWorkflow).toContain("cancel-in-progress: false");
    expect(cdWorkflow).not.toContain("queue:");
  });

  it("uses hosted OIDC publication without npm write tokens", () => {
    expect(cdWorkflow).toContain("runs-on: ubuntu-latest");
    expect(cdWorkflow).toContain("environment: production");
    expect(cdWorkflow).toContain("id-token: write");
    expect(cdWorkflow).toContain("--provenance");
    expect(cdWorkflow).toContain("npm publish");
    expect(cdWorkflow).not.toContain("NPM_TOKEN");
    expect(cdWorkflow).not.toContain("NODE_AUTH_TOKEN");
    expect(npmConfig).not.toContain("_authToken");
    expect(npmConfig).not.toContain("NODE_AUTH_TOKEN");
  });

  it("keeps dependency code out of the OIDC mutation job", () => {
    const validationJob = cdWorkflow.slice(
      cdWorkflow.indexOf("\n  validate_and_pack:"),
      cdWorkflow.indexOf("\n  publish:"),
    );
    const publishJob = cdWorkflow.slice(cdWorkflow.indexOf("\n  publish:"));

    expect(validationJob).toContain(
      "npm ci --no-fund --no-audit --legacy-peer-deps",
    );
    expect(validationJob).toContain("npm pack --ignore-scripts --json");
    expect(validationJob).toContain("actions/upload-artifact@v7");
    expect(validationJob).not.toContain("environment: production");
    expect(validationJob).not.toContain("id-token: write");
    expect(publishJob).toContain("actions/download-artifact@v8");
    expect(publishJob).toContain("digest-mismatch: error");
    expect(publishJob).not.toContain("npm ci");
    expect(publishJob).not.toContain("npm run ");
  });

  it("does not terminate the tar listing early under pipefail", () => {
    expect(cdWorkflow).toContain(
      `tar -tzf "\${TARBALL}" | grep -E '^package/dist(/|$)' >/dev/null`,
    );
    expect(cdWorkflow).not.toContain(
      `tar -tzf "\${TARBALL}" | grep -Eq '^package/dist(/|$)'`,
    );
  });

  it("publishes the immutable tarball as an explicit local path", () => {
    expect(cdWorkflow).toContain(
      'npm publish "./${TARBALL}" --ignore-scripts "${PUBLISH_ARGS[@]}"',
    );
    expect(cdWorkflow).not.toContain(
      'npm publish "${TARBALL}" --ignore-scripts "${PUBLISH_ARGS[@]}"',
    );
  });

  it("lands release metadata through a unique non-force-pushed pull request", () => {
    expect(releasePrepareWorkflow).toContain(
      'BRANCH="release/${TAG}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"',
    );
    expect(releasePrepareWorkflow).not.toContain(
      'git push origin "HEAD:${BASE_BRANCH}"',
    );
    expect(releasePrepareWorkflow).not.toContain("--force-with-lease");
    expect(releasePrepareWorkflow).not.toContain("secrets: inherit");
    expect(releasePrepareWorkflow).toContain(
      'if gh pr merge "${PR_NUMBER}" --squash --delete-branch >/dev/null 2>&1; then',
    );
  });

  it("keeps the release pre-identity parser valid JavaScript", () => {
    const match = releasePrepareWorkflow.match(
      /EFFECTIVE_PREID=\$\([^\n]* node -e '\n([\s\S]*?)\n\s*'\)/u,
    );
    expect(match?.[1]).toBeTruthy();
    const checked = spawnSync(process.execPath, ["--check"], {
      input: match?.[1] ?? "",
      encoding: "utf8",
    });
    expect(checked.stderr).toBe("");
    expect(checked.status).toBe(0);
  });

  it("never reuses an incomplete version whose existing tag points behind main", () => {
    expect(releasePrepareWorkflow).toContain(
      'CURRENT_HEAD_SHA="$(git rev-parse HEAD)"',
    );
    expect(releasePrepareWorkflow).toContain(
      'CURRENT_TAG_SHA="$(git rev-list -n 1 "${CURRENT_TAG}" 2>/dev/null || true)"',
    );
    expect(releasePrepareWorkflow).toContain(
      '[ -z "${CURRENT_TAG_SHA}" ] || [ "${CURRENT_TAG_SHA}" = "${CURRENT_HEAD_SHA}" ]',
    );
  });
});
