import prepublish from './prepublish';
import postpublish from './postpublish';
import {
    publishModule
} from './../utils';

export default () => {
    let publishResult;

    prepublish(() => {
        try {
            publishResult = publishModule();
        } finally {
            postpublish();

            /* eslint-disable no-console */
            console.log(publishResult);
            /* eslint-enable no-console */
        }
    });
};
