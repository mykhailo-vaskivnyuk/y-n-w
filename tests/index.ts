import path from 'path';
import test from 'node:test';
import assert from 'node:assert';
import App from '../src/app/app';
import config from '../src/config';
import { handleOperation } from './mock/connection.handleOperation';

config.inConnection.http = {
  ...config.inConnection.http,
  path: path.join(__dirname, './mock/connection'),
};
config.inConnection.ws = config.inConnection.http;

test('health', async () => {
  await new App(config).start();
  const result = await handleOperation({
    options: {
      sessionKey: 'sessionKey',
      origin: 'origin',
    },
    names: ['health'],
    data: { params: {} },
  });
  assert.strictEqual(result, 'API IS READY');
});
