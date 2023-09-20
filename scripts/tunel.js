/* eslint-disable max-len */
const ngrok = require('ngrok');

const addr = process.argv[2] || 3000; // port

const config = {
  proto: 'http', // http|tcp|tls, defaults to http
  addr, // port or network address, defaults to 80
  // basic_auth: 'user:pwd', // http basic authentication for tunnel
  // subdomain: 'alex', // reserved tunnel name https://alex.ngrok.io
  authtoken: '2VOQImOTAGmAZJZjFqLYeYFNfCr_3tXM3wtZ15aL8df74Q9CH', // your authtoken from ngrok.com
  region: 'us', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
  // configPath: '~/git/project/ngrok.yml', // custom path for ngrok config file
  // binPath: path => path.replace('app.asar', 'app.asar.unpacked'), // custom binary path, eg for prod in electron
  // onStatusChange: status => {}, // 'closed' - connection is lost, 'connected' - reconnected
  // onLogEvent: console.log, // returns stdout messages from ngrok process
};

async function startTunel() {
  const url = await ngrok.connect(config);
  console.log(url);
}

startTunel();
