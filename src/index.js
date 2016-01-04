import yargs from 'yargs';
import {
    publish,
    prepublish,
    postpublish
} from './commands';

let argv,
    command;

yargs
    .usage('$0 command')
    .command('publish')
    .command('prepublish')
    .command('postpublish')
    .demand(1, 'Must provide a valid command.');

argv = yargs.argv;

command = argv._[0];

if (command === 'publish') {
    publish();
} else if (command === 'prepublish') {
    prepublish();
} else {
    postpublish();
}
