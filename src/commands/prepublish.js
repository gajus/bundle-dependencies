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
    // NPM will run prepublish script after `npm install` (https://docs.npmjs.com/misc/scripts)
    // This ensures that when script is executed using `npm *` it is run only when the command is `npm publish`.
    if (process.env.npm_config_argv) {
        let npmConfigArgv;

        npmConfigArgv = JSON.parse(process.env.npm_config_argv);

        if (npmConfigArgv.original[0] !== 'publish') {
            return;
        }
    }

    backupPackageConfig();

    fs.renameSync(nodeModulesPath, nodeModulesBackupPath);

    installProductionModules();

    fs.renameSync(nodeModulesPath, bundledModulesPath);
    fs.renameSync(nodeModulesBackupPath, nodeModulesPath);

    updatePublishPackageConfig();
};
