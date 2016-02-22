#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import getDependencyNames from './../utilities/getDependencyNames';

const publishScriptCommandHandler = (argv) => {
    const packagePath = path.resolve(process.cwd(), 'package.json');
    const packageDefinition = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const bundledDependencyNames = packageDefinition.bundledDependencies;

    if (!bundledDependencyNames.length) {
        throw new Error('bundledDependencies cannot be empty.');
    }

    console.log(bundledDependencyNames.join(' '));
};

const updateCommandBuilder = (subYargs) => {
    return subYargs
        .options({
            exclude: {
                default: [],
                describe: 'A space-separated list of dependencies not to include in the bundledDependencies definition.',
                type: 'array'
            }
        });
};

const updateCommandHandler = (argv) => {
    const excludeDependencyNames = argv.exclude;
    const packagePath = path.resolve(process.cwd(), 'package.json');
    const packageDefinition = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const packageDependencyNames = getDependencyNames(packageDefinition);
    const bundledDependencyNames = packageDependencyNames
        .filter((dependencyName) => {
            return excludeDependencyNames.indexOf(dependencyName) === -1;
        });

    delete packageDefinition.bundleDependencies;

    packageDefinition.bundledDependencies = bundledDependencyNames;

    fs.writeFileSync(packagePath, JSON.stringify(packageDefinition, '', 2));
};

yargs
    .help()
    .strict()
    .command('list-bundled-dependencies', 'Lists names of bundled dependencies.', publishScriptCommandHandler)
    .command('update', 'Updates package.json bundledDependencies definition.', updateCommandBuilder, updateCommandHandler)
    .argv;
