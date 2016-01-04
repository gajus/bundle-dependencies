import yargs from 'yargs';
import {
    prepublish,
    postpublish
} from './commands';

let argv,
    command;

yargs
    .usage('$0 command')
    .command('prepublish')
    .command('postpublish')
    .demand(1, 'Must provide a valid command.');

argv = yargs.argv;

command = argv._[0];

if (command === 'prepublish') {
    prepublish();
} else {
    postpublish();
}
