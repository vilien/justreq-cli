'use strict';
const colors = require('colors');
const co = require('co');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const readline = require('readline').createInterface({input: process.stdin,output: process.stdout});

function read(question, notNull, errTips, patt) {
  return new Promise((resolve, reject)=>{
    (function re(resolve) {
      readline.question('> ' + question + ' ', answer=>{
        if ((!answer && notNull) || (answer && patt && !patt.test(answer))) {
          if (errTips) console.log(errTips);
          re(resolve);
        } else {
          resolve(answer);
        }
      });
    })(resolve);
  });
}

const Init = function(options) {
  let settings = {}, strSettings, confirm;
  co(function* (){
    settings.host = yield read('The remote\'s hostname of you wanna proxy?', true, '');
    settings.port = yield read('What is the remote\'s port? (default: 80)', false, 'Invalid input!', /^\d{1,5}$/);
    settings.port = parseInt(settings.port) || 80;
    settings.cacheTime = yield read('Cache\'s timeout? (value in "h", "m", "s", default: 20m)', false, 'Invalid input!', /^\d+[hms]$/);
    settings.cacheTime = settings.cacheTime || '20m';
    settings.cachePath = yield read('Cache\'s directory? (default: \'.jr/cache/\')');
    settings.cachePath = settings.cachePath || '.jr/cache/';
    settings.substitutePath = yield read('Substitution\'s directory? (default: \'.jr/subs/\')');
    settings.substitutePath = settings.substitutePath || '.jr/subs/';
    settings.jrPort = yield read('The port of JR server? (default: 8000)', false, 'Invalid input!', /^\d{1,5}$/);
    settings.jrPort = parseInt(settings.jrPort) || 8000;
    settings.proxyTimeout = yield read('Proxy\'s timeout? (default: 6s)', false, 'Invalid input!', /^\d+[hms]$/);
    settings.proxyTimeout = settings.proxyTimeout || '6s';
    settings.rules = [];
    if (!/^no$/i.test(yield read('Try to keep fresh always? (yes/no, default: yes)'))) {
      settings.rules.push({
        url: '.+',
        keepFresh: true
      });
    }
    strSettings = JSON.stringify(settings, null, 2);
    console.log('\nThe \'.justreq\' will look like this');
    console.log('===================================');
    console.log(strSettings);
    console.log('===================================');
    confirm = yield read('Is it seem ok? (yes/no, default: yes)');
  }).then(()=>{
    if (/^no$/i.test(confirm)) {
      Init(options);
    } else {
      readline.close();
      fs.writeFile(path.resolve(cwd, '.justreq'), strSettings);
      console.log('Finished!');
    }
  });
};

module.exports = Init;
