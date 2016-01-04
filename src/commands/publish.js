import {
    prepublish,
    postpublish
} from './';
import {
    publishModule
} from './../utils';

export default () => {
    let publishResult;

    prepublish();

    try {
        publishResult = publishModule();
    } catch (error) {
        console.log('error', error);
    }

    postpublish();

    console.log(publishResult);
};
