import fs from 'fs';
import {
    bundledModulesPath,
    nodeModulesBackupPath,
    nodeModulesPath
} from './../paths';
import {
    backupPackageConfig,
    installProductionModules,
    updatePublishPackageConfig
} from './../utils';

export default () => {
    backupPackageConfig();

    fs.renameSync(nodeModulesPath, nodeModulesBackupPath);

    installProductionModules();

    fs.renameSync(nodeModulesPath, bundledModulesPath);
    fs.renameSync(nodeModulesBackupPath, nodeModulesPath);

    updatePublishPackageConfig();
};
