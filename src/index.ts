import app = require('./app/app');
import connection = require('./server/http');
import router = require('./router/router');
import db = require('./db/db');

app
  .setInConnection(connection)
  .setRouter(router)
  .setDatabase(db)
  .start();
