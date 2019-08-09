'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Task = require('../Task');

var _Task2 = _interopRequireDefault(_Task);

var _execLifecycleScript = require('./exec-lifecycle-script');

var _execLifecycleScript2 = _interopRequireDefault(_execLifecycleScript);

var _preparePackage = require('./prepare-package');

var _preparePackage2 = _interopRequireDefault(_preparePackage);

var _uploadPackage = require('./upload-package');

var _uploadPackage2 = _interopRequireDefault(_uploadPackage);

var _getRegistryUrl = require('./get-registry-url');

var _getRegistryUrl2 = _interopRequireDefault(_getRegistryUrl);

var _getGitTagName = require('./get-git-tag-name');

var _getGitTagName2 = _interopRequireDefault(_getGitTagName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PublishTask extends _Task2.default {
  async run({ registry, pkgPath = process.cwd() } = {}) {
    this.emit('subtask', 1, 5, '👀  Reading and validating package.json');
    // 1 - Read and validate package.json.
    await this.readPackageManifest(pkgPath);
    this.emit('subtask', 2, 5, '🏇  Running prepublish scripts');
    // 2 - Run prepublish scripts.
    // NOTE: this scripts might modify the package.json so we need to reload it.
    await (0, _execLifecycleScript2.default)('prepublish', this.pkg, pkgPath, async () => {
      await this.readPackageManifest(pkgPath);
    });
    await (0, _execLifecycleScript2.default)('prepublishOnly', this.pkg, pkgPath, async () => {
      await this.readPackageManifest(pkgPath);
    });
    await (0, _execLifecycleScript2.default)('prepare', this.pkg, pkgPath, async () => {
      await this.readPackageManifest(pkgPath);
    });
    // 3 - Prepare package: npm pack and untar tarball to temp dir.
    this.emit('subtask', 3, 5, '⚙️  Preparing package');
    await (0, _preparePackage2.default)(this.pkg, pkgPath);
    this.emit('subtask', 4, 5, '⬆️  Uploading package');
    // 4 - Upload package: create git tag from temp dir
    // and push to resolved gitpkg registry.
    const gitpkgRegistryURL = await (0, _getRegistryUrl2.default)(registry, this.pkg, pkgPath);
    await (0, _uploadPackage2.default)(this.pkg, pkgPath, gitpkgRegistryURL);
    // 5 - Run postpublish scripts.
    this.emit('subtask', 5, 5, '🏇 Running postpublish scripts');
    await (0, _execLifecycleScript2.default)('publish', this.pkg, pkgPath);
    await (0, _execLifecycleScript2.default)('postpublish', this.pkg, pkgPath);

    return {
      gitpkgRegistry: gitpkgRegistryURL,
      gitpkgPackage: (0, _getGitTagName2.default)(this.pkg),
      name: this.pkg.name,
      version: this.pkg.version
    };
  }
}
exports.default = PublishTask;
//# sourceMappingURL=index.js.map