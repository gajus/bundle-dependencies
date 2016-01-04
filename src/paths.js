import path from 'path';

let bundledModulesTarPath,
    nodeModulesBackupPath,
    nodeModulesPath,
    packageConfigBackupPath,
    packageConfigPath;

packageConfigPath = path.resolve(process.cwd(), './package.json');
packageConfigBackupPath = path.resolve(process.cwd(), './.backup.package.json');
nodeModulesPath = path.resolve(process.cwd(), './node_modules');
nodeModulesBackupPath = path.resolve(process.cwd(), './.backup.node_modules');
bundledModulesTarPath = path.resolve(process.cwd(), './bundled_modules.tar');

export {
    bundledModulesTarPath,
    nodeModulesBackupPath,
    nodeModulesPath,
    packageConfigBackupPath,
    packageConfigPath
};
