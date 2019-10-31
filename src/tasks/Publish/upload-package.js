import * as semver from "semver";
import path from "path";
import execLikeShell from "./exec-like-shell";
import getTempDir from "./get-temp-dir";
import getGitTagName from "./get-git-tag-name";

export default async function uploadPackage(pkg, pkgPath, registry) {
  const pkgTempDir = await getTempDir(pkg);
  const pkgTempDirPkg = path.join(pkgTempDir, "package");
  const gitpkgPackageName = getGitTagName(pkg);
  await execLikeShell("git init", pkgTempDirPkg);
  await execLikeShell("git add .", pkgTempDirPkg);
  await execLikeShell("git commit -m a", pkgTempDirPkg);
  await execLikeShell(`git remote add origin ${registry}`, pkgTempDirPkg);

  // <Relive>
  // 1. Fetch all tags from remote
  await execLikeShell(`git fetch --all`, pkgTempDirPkg);
  await execLikeShell(`git fetch --tags`, pkgTempDirPkg);

  // 2. Get all tags from the registry
  const { stdout } = await execLikeShell(
    `git ls-remote --tags origin`,
    pkgTempDirPkg
  );

  let revisions = stdout
    .split("\n")
    .map(row => {
      return row.split("\t")[1];
    })
    .filter(tag => tag.includes(`${gitpkgPackageName}-v`))
    .map(tag => {
      const version = tag.match(/v(\d+\.)?(\d+\.)?(\*|\d+)$/g)[0];
      if (version) {
        return version.replace("v", "");
      }
    })
    .filter(x => x)
    .sort((a, b) => (semver.gte(a, b) ? 1 : -1));

  const currentVersion = revisions.length
    ? revisions[revisions.length - 1]
    : undefined;

  const newVersion = currentVersion
    ? semver.inc(currentVersion, "patch")
    : "0.0.1";

  if (currentVersion) {
    let changed = await new Promise(async (resolve, reject) => {
      try {
        // 3. Diff the current version with the changes
        // Exits with code 1 when changes are available
        const changes = await execLikeShell(
          `git diff ${gitpkgPackageName}-v${currentVersion} --quiet`,
          pkgTempDirPkg
        );

        if (changes.code === 0) {
          resolve(false);
        }
      } catch (e) {
        if (e.code === 1) {
          resolve(true);
          return;
        }
        reject(e);
      }
    });

    if (!changed) {
      console.log("No changes detected");
      return;
    }
  }

  // 4. Tag new version & Push
  await execLikeShell(
    `git tag ${gitpkgPackageName}-v${newVersion}`,
    pkgTempDirPkg
  );
  await execLikeShell(
    `git push origin ${gitpkgPackageName}-v${newVersion}`,
    pkgTempDirPkg
  );
  // </Relive>
}
