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
  // 1. Fetch all tags from remote
  await execLikeShell(`git fetch --all`, pkgTempDirPkg);
  await execLikeShell(`git fetch --tags`, pkgTempDirPkg);

  // 2. Check if the tag already exists
  const { stdout } = await execLikeShell(
    `git ls-remote --tags origin | grep refs/tags/${gitpkgPackageName}`
  );

  if (stdout) {
    const changed = await new Promise(async (resolve, reject) => {
      try {
        // 3. Diff the tag from remote with current added changes
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
        reject(err);
      }
    });

    if (!changed) {
      console.log("No changes detected");
      return;
    }

    try {
      // 4. Because we fetched all tags from the remote we need to delete the remote
      // and local tag otherwise we cannot publish to the same tag
      await execLikeShell(
        `git push --delete origin ${gitpkgPackageName}`,
        pkgTempDirPkg
      );
      await execLikeShell(`git tag -d ${gitpkgPackageName}`, pkgTempDirPkg);
    } catch (e) {
      console.warn(e);
    }
  }

  // 5. Tag & Push
  await execLikeShell(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);
  await execLikeShell(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
  // </Relive>
}
