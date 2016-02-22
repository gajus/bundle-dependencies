# bundle-dependencies

[![NPM version](http://img.shields.io/npm/v/bundle-dependencies.svg?style=flat-square)](https://www.npmjs.org/package/bundle-dependencies)
[![Travis build status](http://img.shields.io/travis/gajus/bundle-dependencies/master.svg?style=flat-square)](https://travis-ci.org/gajus/bundle-dependencies)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

Generates [`bundledDependencies`](https://docs.npmjs.com/files/package.json#bundleddependencies) `package.json` value using values of the dependencies property. Updates `package.json` definition using the generated `bundledDependencies` value.

## Install

```sh
npm install bundle-dependencies
```

Add to `package.json`:

```json
{
    "scripts": {
        "bundle-dependencies": "bundle-dependencies"
    }
}
```

## Options

```sh
bundle-dependencies --help
```

```
Options:
  --help     Show help                                                 [boolean]
  --exclude  A space-separated list of dependencies not to include in the
             bundledDependencies definition.               [array] [default: []]
```

## Usage

To simply update `bundledDependencies` of the `package.json` in the current working directory, execute the script:

```sh
npm run bundle-dependencies
```

## Publishing

When publishing a package using `bundledDependencies` property, make sure that your `nodu_modules/` directory includes only `dependencies`, i.e. the module must be install using `npm install --production`. Use this script to do it:

```json
{
    "bundle-publish": "npm run bundle-dependencies; git commit -m 'Bundled dependencies.' ./package.json; git push; rm -fr ./node_modules; npm install --production; npm dedupe; npm prune; npm publish; npm install;"
}
```
