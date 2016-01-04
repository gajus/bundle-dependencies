# bundle-dependencies

[![NPM version](http://img.shields.io/npm/v/bundle-dependencies.svg?style=flat-square)](https://www.npmjs.org/package/bundle-dependencies)
[![Travis build status](http://img.shields.io/travis/gajus/bundle-dependencies/master.svg?style=flat-square)](https://travis-ci.org/gajus/bundle-dependencies)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

Bundles (deep) all module dependencies into a monolithic NPM package.

`bundle-dependencies` is designed to be used with `devDependencies` and modules installed using `--global` flag.

How much time can it save? Lets see.

`2.3.38` release is done using `bundle-dependencies`.

```sh
time npm install pragmatist@2.3.38

test@1.0.0 /Users/gajus/Desktop/test
└── pragmatist@2.3.38  extraneous

npm install pragmatist@2.3.38

3.00s user
0.92s system
62% cpu
6.278 total
```

`2.3.38` release is done using `bundle-dependencies`.

`2.3.37` release is done without using `bundle-dependencies`.

```sh
time npm install pragmatist@2.3.37

test@1.0.0 /Users/gajus/Desktop/test
└── pragmatist@2.3.37  extraneous

npm install pragmatist@2.3.37

34.72s user
6.10s system
24% cpu
2:46.92 total
```

166

## Usage

```sh
npm install bundle-dependencies --save-dev
```

Add to `package.json`:

```json
{
    "scripts": {
        "publish-bundle": "node ./node_modules/.bin/bundle-dependencies publish"
    }
}
```

### `.npmignore`

Make sure that `.npmignore` (and `.gitignore`) has:

```
.package.json.backup
.node_modules.backup
```

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
