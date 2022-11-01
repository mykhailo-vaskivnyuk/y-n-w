import config = require('./config');
import App from './app/app';
import Logger from './logger/logger';
import DbConnection from './db/connection/pg';
import Router from './router/router';
import InputConnection from './server/http';

// import loader from './loader/loader';
// const moduleExport = loader('./loader/test.module.js');
// console.log('export', moduleExport);
// const arr = new Array(1);
// console.log('myMethod' in arr);

new App(config)
  .setLogger(Logger)
  .setDatabase(DbConnection)
  .setRouter(Router)
  .setInputConnection(InputConnection)
  .start();

// TODO
// Modules => require
