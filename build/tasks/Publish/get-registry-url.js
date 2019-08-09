'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gitRemoteOriginUrl = require('git-remote-origin-url');

var _gitRemoteOriginUrl2 = _interopRequireDefault(_gitRemoteOriginUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function getRegistryURL(userRegistry, pkg, pkgPath) {
  if (userRegistry) {
    return userRegistry;
  }

  if (pkg && pkg.gitpkg && pkg.gitpkg.registry) {
    return pkg.gitpkg.registry;
  }

  const registryDefault = await (0, _gitRemoteOriginUrl2.default)(pkgPath);

  return registryDefault;
};
//# sourceMappingURL=get-registry-url.js.map