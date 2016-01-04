import fse from 'fs-extra';
import {
    bundledModulesTarPath
} from './../paths';
import {
    restorePackageConfig
} from './../utils';

export default () => {
    restorePackageConfig();

    fse.removeSync(bundledModulesTarPath);
};
