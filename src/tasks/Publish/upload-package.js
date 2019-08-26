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
  await execLikeShell("git commit -m gitpkg", pkgTempDirPkg);
  await execLikeShell(`git remote add origin ${registry}`, pkgTempDirPkg);

  // <Relive>
  await execLikeShell(`git fetch --tags`, pkgTempDirPkg);
  let changed = await execLikeShell(
    `git diff --quiet ${gitpkgPackageName};echo $?`,
    pkgTempDirPkg
  );

  console.log(changed);
  changed = false;

  if (!changed) {
    console.log("No changes detected");
    return;
  }

  await execLikeShell(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);

  try {
    await execLikeShell(
      `git push --delete origin ${gitpkgPackageName}`,
      pkgTempDirPkg
    );
  } catch (e) {
    console.warn(e);
  }
  await execLikeShell(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
  // </Relive>
}
