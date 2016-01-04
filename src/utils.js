import pkg from './../package.json';
import _ from 'lodash';
import path from 'path';
import {
    execSync
} from 'child_process';
import fs from 'fs';
import fse from 'fs-extra';
import {
    bundledModulesTarPath,
    packageConfigBackupPath,
    packageConfigPath,
    nodeModulesPath
} from './paths';
import tar from 'tar-fs';

let backupPackageConfig,
    compressNodeModules,
    fileExists,
    installProductionModules,
    publishModule,
    restorePackageConfig,
    uncompressNodeModules,
    updatePublishPackageConfig;

fileExists = (filePath) => {
    try {
        fs.statSync(filePath);

        return true;
    } catch (error) {
        return false;
    }
};

compressNodeModules = (done) => {
    let stream;

    stream = fs.createWriteStream(bundledModulesTarPath);

    tar.pack(nodeModulesPath).pipe(stream);

    stream.on('finish', () => {
        done();
    });
};

uncompressNodeModules = (done) => {
    let stream;

    stream = fs.createReadStream('./node_modules.tar');

    tar.extract('./node_modules').pipe(stream);

    stream.on('finish', () => {
        done();
    });
};

backupPackageConfig = () => {
    if (!fileExists(packageConfigPath)) {
        throw new Error('./' + path.basename(packageConfigPath) + ' does not exist.');
    }

    if (fileExists(packageConfigBackupPath)) {
        throw new Error('./' + path.basename(packageConfigBackupPath) + ' already exists.');
    }

    fse.copySync(packageConfigPath, packageConfigBackupPath);
};

restorePackageConfig = () => {
    if (!fileExists(packageConfigBackupPath)) {
        throw new Error('./' + path.basename(packageConfigBackupPath) + ' does not exist.');
    }

    fse.copySync(packageConfigBackupPath, packageConfigPath);

    fse.removeSync(packageConfigBackupPath);
};

updatePublishPackageConfig = () => {
    let packageConfig;

    packageConfig = fse.readJsonSync(packageConfigBackupPath);

    packageConfig.scripts = packageConfig.scripts || {};
    packageConfig.scripts.postinstall = packageConfig.scripts.postinstall || '';

    if (packageConfig.scripts.postinstall) {
        packageConfig.scripts.postinstall = _.trimRight(packageConfig.scripts.postinstall, '; ');
        packageConfig.scripts.postinstall += '; ';
    }

    // packageConfig.scripts.postinstall += 'echo "OK"';
    packageConfig.scripts.postinstall += 'bundle-dependencies extract';

    packageConfig.dependencies = {
        'bundle-dependencies': pkg.version
    };
    packageConfig.devDependencies = {};

    fse.writeJsonSync(packageConfigPath, packageConfig);
};

publishModule = () => {
    return execSync('npm publish', {
        cwd: process.cwd(),
        encoding: 'utf8'
    });
};

installProductionModules = () => {
    return execSync('npm install --production', {
        cwd: process.cwd(),
        encoding: 'utf8'
    });
};

export {
    backupPackageConfig,
    compressNodeModules,
    installProductionModules,
    publishModule,
    restorePackageConfig,
    uncompressNodeModules,
    updatePublishPackageConfig
};
