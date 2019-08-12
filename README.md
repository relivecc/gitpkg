# Relive gitpkg

gitpkg publishes npm packages as git tags. We use this to publish client files / types of server-projects that can be consumed in client apps.

Example:

- Create a regular lambda project (let's say, https://github.com/relivecc/my-lambda)
- Put a client project in @client directory, with a package.json name of `my-lambda-client`
- Set up Travis to run `yarn gitpkg` in client directory, when merging to master (see `skyhawk-lambda-activitystreams` sample)
- Client projects can now use https://github.com/relivecc/packages#skyhawk-lambda-activitystreams-client to consume the lambda
- Of course, you still need to deploy the lambda in codepipeline

## Changes to this repo

This repo itself is also published as a gitpkg in https://github.com/relivecc/gitpkg#gitpkg. Use `yarn gitpkg` to publish changes.

# original gitpkg readme

<div align="center">
  <a href="https://travis-ci.org/ramasilveyra/gitpkg?branch=master">
    <img src="https://travis-ci.org/ramasilveyra/gitpkg.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://codecov.io/github/ramasilveyra/gitpkg?branch=master">
    <img src="https://img.shields.io/codecov/c/github/ramasilveyra/gitpkg.svg?branch=master" alt="Codecoverage">
  </a>
</div>

<h1 align="center">gitpkg</h1>

<p align="center"><b>Publish packages as git tags</b></p>
<p align="center">
🔧 Works with projects with build steps.<br />
👯 Works with projects with multiple packages (monorepos).<br />
🏎 Lightweight git tags (only the files needed are included).
</p>

<h2 align="center">Table of Contents</h2>

- [Background](#background)
  - [Terminology](#terminology)
- [Install](#install)
- [Usage](#usage)
  - [Publish](#publish)
- [Contribute](#contribute)
- [License](#license)

<h2 align="center">Background</h2>

Both npm and yarn support installing packages from git tags.

But things can get difficult with packages that have a build step (eg [babel](https://github.com/babel/babel)) and monorepos with multiples packages (eg [lerna](https://github.com/lerna/lerna)).

`gitpkg publish` creates a git tag with the same files as if you were running `npm publish` or `yarn publish` and uploads the generated git tag to a git repository.

Also you can publish any gitpkg package to the same repository, so you can have only one repository used as common registry and you get away from your project git repository the git tags with the build code.

### Terminology:

- **gitpkg package**: git tag generated by gitpkg.
- **gitpkg registry**: git repository used as common host for your gitpkg packages.

<h2 align="center">Install</h2>

**Node.js v6.5 or newer** is required.

### npm registry

Via the yarn client:

```bash
$ yarn global add gitpkg
```

Via the npm client:

```bash
$ npm install -g gitpkg
```

### gitpkg registry

Via the yarn client:

```bash
$ yarn global add ramasilveyra/public-registry#gitpkg-v1.0.0-beta.1-gitpkg
```

Via the npm client:

```bash
$ npm install -g ramasilveyra/public-registry#gitpkg-v1.0.0-beta.1-gitpkg
```

<h2 align="center">Usage</h2>

### Publish

Publishes a package to a git repository, by default uploads the package to the git repository in the git remote origin (`git remote -v` to see your git remote origin url). The package published is defined by the package.json in the current directory.

```bash
$ gitpkg publish
```

[See in action](https://user-images.githubusercontent.com/7464663/27548379-318b38f8-5a6f-11e7-978c-b5a2f6677e61.gif).

#### --registry, -r

```bash
$ gitpkg publish --registry git@mygit.server:org/private-registry.git
```

This flag tells gitpkg to publish the package to a specific gitpkg registry.

You can also set the gitpkg registry permanently by adding `"gitpkg":{"registry":"git@mygit.server:org/private-registry.git"}` to the package.json.

<h2 align="center">Contribute</h2>

Feel free to dive in! [Open an issue](https://github.com/ramasilveyra/gitpkg/issues/new) or submit PRs.

gitpkg follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

<h2 align="center">License</h2>

[MIT © Ramiro Silveyra d'Avila](LICENSE.md)
