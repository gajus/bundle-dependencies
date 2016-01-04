import {
    prepublish,
    postpublish
} from './';
import {
    publishModule
} from './../utils';

export default () => {
    prepublish();

    try {
        publishModule();
    } catch (error) {
        console.log('error', error);
    }

    postpublish();
};
