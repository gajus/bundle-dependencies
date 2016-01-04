import fse from 'fs-extra';
import {
    bundledModulesPath
} from './../paths';
import {
    restorePackageConfig
} from './../utils';

export default () => {
    restorePackageConfig();

    fse.removeSync(bundledModulesPath);
};
