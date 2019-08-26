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
  await execLikeShell(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);

  console.log(gitpkgPackageName, pkgTempDirPkg);
  const x = await execLikeShell(
    `git diff --quiet master; echo $?`,
    pkgTempDirPkg
  );
  console.log(x);

  // change Relive; first delete the tag
  try {
    await execLikeShell(
      `git push --delete origin ${gitpkgPackageName}`,
      pkgTempDirPkg
    );
  } catch (e) {
    console.warn(e);
  }
  await execLikeShell(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
}
