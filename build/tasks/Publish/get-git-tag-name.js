'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGitTagName;

var _normalisePackageName = require('./normalise-package-name');

function getGitTagName(pkg) {
  const gitpkgPackageName = `${(0, _normalisePackageName.normalisePackageNameNpm)(pkg.name)}`;
  return gitpkgPackageName;
}
//# sourceMappingURL=get-git-tag-name.js.map