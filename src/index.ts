import app = require('./app/app');
import logger = require('./logger/logger');
import inConnection = require('./server/http');
import router = require('./router/router');
import dbConnection = require('./db/connection/pg');

app
  .setLogger(logger)
  .setInConnection(inConnection)
  .setRouter(router)
  .setDatabase(dbConnection)
  .start();
