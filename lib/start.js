'use strict';
const colors = require('colors');
const path = require('path');
const fs = require('fs');
const co = require('co');
const cwd = process.cwd();
const mkdirp = require('mkdirp');

/**
 * Load configuration & start JR server.
 * @param {json}  args  Configuration of commander caught
 * @param {json}  pkg   Configuration of package.json
 */
const Start = function(args, pkg) {
  console.log('Starting JR server...'['green']);
  co(()=>new Promise((resolve, reject)=>{
    fs.readFile(cwd + '/.justreq', 'utf8', function (error,data){
      if(error) {
        console.log('Error: Cannot open \'.justreq\''['red']);
        console.log('Try to run \'justreq init\''['red']);
        process.exit();
      } else {
        try {
          let opts = JSON.parse(data);
          resolve(JSON.parse(data));
        } catch(err) {
          console.log('Read \'.justreq\' failed.'['red']);
          console.log(err.toString()['red']);
          process.exit();
        }
      }
    });})
  ).then((options)=>{
    let settings = options;
    settings.version      = pkg.version;
    settings.host         = args.host || settings.host;
    settings.port         = args.port || settings.port || 80;
    settings.cacheTime    = args.time || settings.cacheTime || '20m';
    settings.cachePath    = path.resolve(settings.cachePath || '.jr/cache/');
    settings.substitutePath= path.resolve(settings.substitutePath || '.jr/subs/');
    settings.tempPath     = path.resolve(settings.tempPath || '.jr/tmp/');
    settings.jrPort       = args.jrport || settings.jrPort || 8000;
    settings.proxyTimeout = settings.proxyTimeout || '6s';
    settings.rules        = settings.rules || [];
    settings.clear        = args.clear;
    settings.fresh        = args.fresh;

    mkdirp(settings.cachePath);
    mkdirp(settings.substitutePath);
    mkdirp(settings.tempPath);

    try {
      let server = require(path.resolve(cwd + '/node_modules/justreq'));
      // clean cache
      if (settings.clear && fs.existsSync(settings.cachePath)) {
        fs.readdirSync(settings.cachePath).forEach((filename)=>{
          fs.unlink(path.resolve(settings.cachePath, filename));
        });
      }
      // clean temp
      if (fs.existsSync(settings.tempPath)) {
        fs.readdirSync(settings.tempPath).forEach((filename)=>{
          fs.unlink(path.resolve(settings.tempPath, filename));
        });
      }
      new server(settings);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND' && /node_modules.justreq/.test(err.toString())) {
        console.log(err.toString()['red']);
        console.log('Try to run \'npm install justreq\''['red']);
      } else {
        console.log(err);
      }
      process.exit();
    }
  });
};
module.exports = Start;
