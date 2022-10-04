import app = require('./app/app');
import connection = require('./server/http');
import routing = require('./routing/routing');

app
  .setConnection(connection)
  .setRouting(routing)
  .start();
