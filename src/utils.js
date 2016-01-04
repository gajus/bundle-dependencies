import path from 'path';
import {
    execSync
} from 'child_process';
import fs from 'fs';
import fse from 'fs-extra';
import {
    bundledModulesPath,
    nodeModulesBackupPath,
    nodeModulesPath,
    packageBackupPath,
    packagePath
} from './paths';

let backupPackageConfig,
    fileExists,
    installProductionModules,
    restorePackageConfig,
    updatePublishPackageConfig;

fileExists = (path) => {
    try {
        fs.statSync(path);

        return true;
    } catch (e) {

    }

    return false;
};

backupPackageConfig = () => {
    if (!fileExists(packagePath)) {
        throw new Error('./' + path.basename(packagePath) + ' does not exist.');
    }

    if (fileExists(packageBackupPath)) {
        throw new Error('./' + path.basename(packageBackupPath) + ' already exists.');
    }

    fse.copySync(packagePath, packageBackupPath);
};

restorePackageConfig = () => {
    if (!fileExists(packageBackupPath)) {
        throw new Error('./' + path.basename(packageBackupPath) + ' does not exist.');
    }

    fse.copySync(packageBackupPath, packagePath);

    fse.removeSync(packageBackupPath);
};

updatePublishPackageConfig = () => {
    let packageConfig;

    packageConfig = fse.readJsonSync(packagePath);

    packageConfig.scripts = packageConfig.scripts || {};
    packageConfig.scripts.postinstall = packageConfig.scripts.postinstall || '';
    packageConfig.scripts.postinstall += '; rm -fr ./node_modules; mv ./bundled_modules ./node_modules';

    packageConfig.dependencies = {};
    packageConfig.devDependencies = {};

    fse.writeJsonSync(packagePath, packageConfig);
};

installProductionModules = () => {
    execSync('npm install --production', {
        cwd: process.cwd()
    });
};

export {
    backupPackageConfig,
    installProductionModules,
    restorePackageConfig,
    updatePublishPackageConfig
};
