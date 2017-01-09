'use strict';

const program = require('commander');
const colors = require('colors');
const pkg = require('../package.json');

let commandName, commandArgs;

program
  .version(pkg.version);

program
  .command('init')
  .description('Initialize a JR proxy server.')
  .action((args)=>{
    commandName = 'init';
    commandArgs = args;
  });

program
  .command('start')
  .description('Start a JR proxy server.')
  .option('-h, --host [value]', 'Set the remote hostname.')
  .option('-p, --port <n>', 'Set the remote port, default is 80.')
  .option('-j, --jrport <n>', 'Set the port of JR Server, default is 8000.')
  .option('-t, --time [value]', 'The time of cache, value in "h", "m", "s". Default is "20m"')
  .option('-c, --clear', 'Clean caches and start JR.')
  // .option('-f, --fresh', 'Run JR without cache.')
  .action((args)=>{
    commandName = 'start';
    commandArgs = args;
  });

program.parse(process.argv);

switch (commandName) {
  case 'init':
    require('./init')(pkg);
  break;
  case 'start':
    require('./start')(commandArgs, pkg);
  break;
  default:
    console.log('Do nothing. Perhaps, you wanna run \'justreq start\', or run \'justreq --help\' to get help'['yellow']);
  break;
}