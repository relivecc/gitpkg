"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _execLikeShell = require("./exec-like-shell");

var _execLikeShell2 = _interopRequireDefault(_execLikeShell);

var _getTempDir = require("./get-temp-dir");

var _getTempDir2 = _interopRequireDefault(_getTempDir);

var _getGitTagName = require("./get-git-tag-name");

var _getGitTagName2 = _interopRequireDefault(_getGitTagName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function uploadPackage(pkg, pkgPath, registry) {
  const pkgTempDir = await (0, _getTempDir2.default)(pkg);
  const pkgTempDirPkg = _path2.default.join(pkgTempDir, "package");
  const gitpkgPackageName = (0, _getGitTagName2.default)(pkg);
  await (0, _execLikeShell2.default)("git init", pkgTempDirPkg);
  await (0, _execLikeShell2.default)("git add .", pkgTempDirPkg);
  await (0, _execLikeShell2.default)("git commit -m gitpkg", pkgTempDirPkg);
  await (0, _execLikeShell2.default)(`git remote add origin ${registry}`, pkgTempDirPkg);
  await (0, _execLikeShell2.default)(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);

  // change Relive; first delete the tag
  try {
    await (0, _execLikeShell2.default)(`git push --delete origin ${gitpkgPackageName}`, pkgTempDirPkg);
  } catch (e) {
    console.warn(e);
  }
  await (0, _execLikeShell2.default)(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
};
//# sourceMappingURL=upload-package.js.map