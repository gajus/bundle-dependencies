# bundle-dependencies

[![NPM version](http://img.shields.io/npm/v/bundle-dependencies.svg?style=flat-square)](https://www.npmjs.org/package/bundle-dependencies)
[![Travis build status](http://img.shields.io/travis/gajus/bundle-dependencies/master.svg?style=flat-square)](https://travis-ci.org/gajus/bundle-dependencies)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

## Deprecated

The original benchmarks of [`bundledDependencies`](https://docs.npmjs.com/files/package.json#bundleddependencies) have been flawed.

To achieve the same result of `bundle-dependencies` using `bundledDependencies` `package.json` property:

1. Add all `dependencies` to `bundledDependencies` `package.json` property.
1. Before publishing, start in clean directory (i.e., `rm -fr ./node_modules`).
1. Install dependencies using `--production` flag (i.e., `npm install --production`).
1. Publish package.

You can use [`bundled-dependencies`](https://www.npmjs.com/package/bundled-dependencies) package to automate the first step.

```sh
npm install bundled-dependencies --save-dev
```

Add to `package.json`:

```json
{
    "scripts": {
        "bundle-dependencies": "bundled-dependencies"
    }
}
```

Run:

```sh
npm run bundle-dependencies
```

## `bundle-dependencies`

Bundles (deep) all module dependencies into a monolithic NPM package.

`bundle-dependencies` is designed to be used with `devDependencies` and modules installed using `--global` flag.

How much time can it save? Lets see.

`2.3.63` release is done without `bundle-dependencies`.

```sh
time npm install pragmatist@2.3.63

34.59s user
6.15s system
24% cpu
2:44.35 total
```

`2.3.64` release is done with `bundle-dependencies`.

```sh
time npm install pragmatist@2.3.64

5.41s user
2.34s system
36% cpu
21.175 total
```

The `bundle-dependencies` install process is 8 times faster (2 minutes 44 seconds compared to 21 second).

## Usage

```sh
npm install bundle-dependencies --save-dev
```

Add to `package.json`:

```json
{
    "scripts": {
        "publish-bundle": "bundle-dependencies publish"
    }
}
```

To publish your package with bundled dependencies, run:

```sh
npm run publish-bundle
```

### `.npmignore`

Add to `.npmignore` (and `.gitignore`):

```
.backup.package.json
.backup.node_modules
```

These are the backup files of your original `./package.json` and `./node_modules`. Do not commit them to the package registry.

## Considerations

* This tool will not work if package has dependencies with native bindings (Issues [#1](https://github.com/gajus/bundle-dependencies/issues/1) and [#2](https://github.com/gajus/bundle-dependencies/issues/2)).

## Implementation

`bundle-dependencies publish` execution flow is:

1. Runs `bundle-dependencies` [internal `prepublish` logic](#internal-prepublish-logic).
1. Executes `npm publish`.
1. Runs `bundle-dependencies` [internal `postpublish` logic](#internal-postpublish-logic).

Do not add `bundle-dependencies` script to `prepublish`, `publish` or `postpublish` `package.json` scripts. NPM copies the contents of `package.json` before `prepublish` script is executed. This makes the [internal `prepublish` logic](#internal-prepublish-logic) impossible. `prepublish` and `postpublish` commands are exposed for testing only.

### Internal `prepublish` logic.

1. Backup the existing `./node_modules`.
1. Backup the existing `./package.json`.
1. Install package dependencies (`npm install --production`).
1. Compress `./node_modules` to `./bundled_modules.tar`.
1. Remove all dependencies from `./package.json`.
1. Add `bundled-dependencies` dependency to `./package.json`.
1. Add `postinstall` script to `./package.json`.

### Internal `postpublish` logic.

1. Delete `./bundled_modules.tar`.
1. Delete `./package.json`.
1. Restore the original `./node_modules`.
1. Restore the original `./package.json`.

### `postinstall` script

The `postinstall` script is:

```sh
bundled-dependencies extract
```

1. Deletes `./node_modules`.
1. Extracts `./bundled_modules.tar` to `./node_modules`.
