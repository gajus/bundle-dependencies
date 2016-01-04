import path from 'path';

let bundledModulesTarPath,
    nodeModulesBackupPath,
    nodeModulesPath,
    packageBackupPath,
    packagePath;

packagePath = path.resolve(process.cwd(), './package.json');
packageBackupPath = path.resolve(process.cwd(), './.package.json.backup');
nodeModulesPath = path.resolve(process.cwd(), './node_modules');
nodeModulesBackupPath = path.resolve(process.cwd(), './.node_modules.backup');
bundledModulesTarPath = path.resolve(process.cwd(), './bundled_modules.tar');

export {
    bundledModulesTarPath,
    nodeModulesBackupPath,
    nodeModulesPath,
    packageBackupPath,
    packagePath
};
