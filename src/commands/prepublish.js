import fs from 'fs';
import fse from 'fs-extra';
import {
    nodeModulesBackupPath,
    nodeModulesPath
} from './../paths';
import {
    backupPackageConfig,
    compressNodeModules,
    installProductionModules,
    updatePublishPackageConfig
} from './../utils';

export default () => {
    backupPackageConfig();

    fs.renameSync(nodeModulesPath, nodeModulesBackupPath);

    installProductionModules();

    compressNodeModules(() => {
        fse.removeSync(nodeModulesPath);
        fs.renameSync(nodeModulesBackupPath, nodeModulesPath);

        updatePublishPackageConfig();
    });
};
