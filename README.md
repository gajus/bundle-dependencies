# bundle-dependencies

[![NPM version](http://img.shields.io/npm/v/bundle-dependencies.svg?style=flat-square)](https://www.npmjs.org/package/bundle-dependencies)
[![Travis build status](http://img.shields.io/travis/gajus/bundle-dependencies/master.svg?style=flat-square)](https://travis-ci.org/gajus/bundle-dependencies)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

Bundles (deep) all module dependencies into a monolithic NPM package.

`bundle-dependencies` is designed to be used with `devDependencies` and modules installed using `--global` flag.

How much time can it save? Lets see.

`2.3.63` release is done without `bundle-dependencies`.

```
time npm install pragmatist@2.3.63
npm WARN deprecated lodash@1.0.2: lodash@<2.0.0 is no longer maintained. Upgrade to lodash@^3.0.0

> fsevents@1.0.6 install /Users/gajus/Desktop/test/node_modules/fsevents
> node-pre-gyp install --fallback-to-build

[fsevents] Success: "/Users/gajus/Desktop/test/node_modules/fsevents/lib/binding/Release/node-v47-darwin-x64/fse.node" is installed via remote
test@1.0.0 /Users/gajus/Desktop/test
└── pragmatist@2.3.63  extraneous

npm WARN EPACKAGEJSON test@1.0.0 No description
npm WARN EPACKAGEJSON test@1.0.0 No repository field.
npm install pragmatist@2.3.63

34.59s user
6.15s system
24% cpu
2:44.35 total
```

`2.3.64` release is done with `bundle-dependencies`.

```
time npm install pragmatist@2.3.64

> pragmatist@2.3.64 postinstall /Users/gajus/Desktop/test/node_modules/pragmatist
> bundle-dependencies extract

test@1.0.0 /Users/gajus/Desktop/test
└── pragmatist@2.3.64  extraneous

npm WARN EPACKAGEJSON test@1.0.0 No description
npm WARN EPACKAGEJSON test@1.0.0 No repository field.
npm install pragmatist@2.3.64

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

## package.json `bundledDependencies`

NPM has a configuration [`bundledDependencies`](https://docs.npmjs.com/files/package.json#bundleddependencies):

> Array of package names that will be bundled when publishing the package.

However, this configuration only bundles the direct dependencies but not dependencies of the dependencies.
