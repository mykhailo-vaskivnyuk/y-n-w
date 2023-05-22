const { runScript } = require('../utils/utils.js');

const script = 'sh tests/db/restore.sh';

runScript(script);
