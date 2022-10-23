import config = require('./config');
import App from './app/app';
import Logger from './logger/logger';
import DbConnection from './db/connection/pg';
import Router from './router/router';
import InputConnection from './server/http';

new App(config)
  .setLogger(Logger)
  .setDatabase(DbConnection)
  .setRouter(Router)
  .setInputConnection(InputConnection)
  .start();

// TODO
// Modules => require
