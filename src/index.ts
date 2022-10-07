import app = require('./app/app');
import logger = require('./logger/logger');
import inputConnection = require('./server/http');
import router = require('./router/router');
import dbConnection = require('./db/connection/pg');

app
  .setLogger(logger)
  .setInputConnection(inputConnection)
  .setRouter(router)
  .setDatabase(dbConnection)
  .start();
