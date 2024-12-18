const { createHmac } = require('crypto');
const { TG_BOT_TOKEN } = require('../.env.json');

// eslint-disable-next-line max-len
const query_string =
  // eslint-disable-next-line max-len
  'query_id=AAEGn4wxAAAAAAafjDEOmHaN&user=%7B%22id%22%3A831299334%2C%22first_name%22%3A%22Mykhailo%22%2C%22last_name%22%3A%22Vaskivnyuk%22%2C%22username%22%3A%22vaskivnyuk%22%2C%22language_code%22%3A%22uk%22%7D&auth_date=1686912720&hash=89e92f1ac9275e4d63835e197de9a0e5de5406fca1b5680d1ce4c42f84a4fd0f';
const queryObj = new URLSearchParams(query_string);
const hash = queryObj.get('hash');
queryObj.delete('hash');
const checkString = [...queryObj.entries()]
  .sort(([a], [b]) => (a > b ? 1 : -1))
  .map(([key, val]) => `${key}=${val}`)
  .join('\n');

const algorithm = 'sha256';
const key1 = 'WebAppData';
const key2 = createHmac(algorithm, key1).update(TG_BOT_TOKEN).digest();
const result = createHmac(algorithm, key2).update(checkString).digest('hex');

console.log(hash);
console.log(result);

if (result === hash) console.log('success');
