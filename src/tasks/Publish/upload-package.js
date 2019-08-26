import path, { resolve } from "path";
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
  await execLikeShell(`git fetch --all`, pkgTempDirPkg);
  await execLikeShell(`git fetch --tags`, pkgTempDirPkg);

  const { stdout } = await execLikeShell(
    `git ls-remote --tags origin | grep refs/tags/${gitpkgPackageName}`
  );

  if (stdout) {
    let changed = await new Promise(async (resolve, reject) => {
      try {
        // Exits with code 1 when changes are available
        const changes = await execLikeShell(
          `git diff ${gitpkgPackageName} --quiet`,
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
        throw new Error(e);
      }
    });

    if (!changed) {
      console.log("No changes detected");
      return;
    }

    try {
      await execLikeShell(
        `git push --delete origin ${gitpkgPackageName}`,
        pkgTempDirPkg
      );
      await execLikeShell(`git tag -d ${gitpkgPackageName}`, pkgTempDirPkg);
    } catch (e) {
      console.warn(e);
    }
  }

  await execLikeShell(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);
  await execLikeShell(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
  // </Relive>
}
