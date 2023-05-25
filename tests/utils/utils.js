const { spawn } = require('node:child_process');

const runProcess = (commandString) => {
  const [command, ...params] = commandString.split(/\s/);

  const ls = spawn(command, params);

  ls.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error('stderr:', `${data}`);
  });

  return new Promise((rv) => {
    ls.on('close', (code) => {
      console.log('Exited with code:', `${code}`);
      rv();
    });
  });
};

exports.runScript = async (script) => {
  const commands = script.split('\n');
  for (const command of commands) {
    await runProcess(command);
  }
};
