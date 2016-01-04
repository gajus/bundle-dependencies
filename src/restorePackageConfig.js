import path from 'path';
import fse from 'fs-extra';
import {
    packageBackupPath,
    packagePath
} from './paths';

export default () => {
    if (!fileExists(packagePath)) {
        throw new Error('./' + path.basename(packagePath) + ' does not exist.');
    }

    if (fileExists(packageBackupPath)) {
        throw new Error('./' + path.basename(packageBackupPath) + ' already exists.');
    }

    fse.copySync(packagePath, packageBackupPath);
};
