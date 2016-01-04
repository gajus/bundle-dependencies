import fse from 'fs-extra';
import {
    uncompressNodeModules
} from './../utils';
import {
    nodeModulesPath
} from './../paths';

export default () => {
    fse.removeSync(nodeModulesPath);

    uncompressNodeModules();
};
