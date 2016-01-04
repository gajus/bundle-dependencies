import path from 'path';

let bundledModulesPath,
    nodeModulesBackupPath,
    nodeModulesPath,
    packageBackupPath,
    packagePath;

packagePath = path.resolve(process.cwd(), './package.json');
packageBackupPath = path.resolve(process.cwd(), './.package.json.backup');
nodeModulesPath = path.resolve(process.cwd(), './node_modules');
nodeModulesBackupPath = path.resolve(process.cwd(), './.node_modules.backup');
bundledModulesPath = path.resolve(process.cwd(), './bundled_modules');

export {
    bundledModulesPath,
    nodeModulesBackupPath,
    nodeModulesPath,
    packageBackupPath,
    packagePath
};
