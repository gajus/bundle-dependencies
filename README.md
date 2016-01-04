# bundle-dependencies

[![NPM version](http://img.shields.io/npm/v/bundle-dependencies.svg?style=flat-square)](https://www.npmjs.org/package/bundle-dependencies)
[![Travis build status](http://img.shields.io/travis/gajus/bundle-dependencies/master.svg?style=flat-square)](https://travis-ci.org/gajus/bundle-dependencies)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

Bundles (deep) all module dependencies into a monolithic NPM package.

## Usage

```sh
npm install bundle-dependencies --save-dev
```

Add to `package.json`:

```json
{
    "scripts": {
        "prepublish": "node ./node_modules/.bin/bundle-dependencies prepublish",
        "postpublish": "node ./node_modules/.bin/bundle-dependencies postpublish"
    }
}
```

## Implementation

Running `npm publish` `bundle-dependencies` script will:

### `prepublish`

1. Backup the existing `./node_modules`.
1. Backup the existing `./package.json`.
1. Install package dependencies (`npm install --production`).
1. Rename `./node_modules` to `./bundled_modules`.
1. Remove all dependencies from `./package.json`.
1. Add `postinstall` script to `./package.json`.

### `postpublish`

1. Delete `./bundled_modules`.
1. Delete `./package.json`.
1. Restore the original `./node_modules`.
1. Restore the original `./package.json`.

## `postinstall` script

The `postinstall` script is:

```sh
; rm -fr ./node_modules; mv ./bundled_modules ./node_modules
```

## package.json `bundledDependencies`

NPM has a configuration [`bundledDependencies`](https://docs.npmjs.com/files/package.json#bundleddependencies):

> Array of package names that will be bundled when publishing the package.

However, this configuration only bundles the direct dependencies but not dependencies of the dependencies.
