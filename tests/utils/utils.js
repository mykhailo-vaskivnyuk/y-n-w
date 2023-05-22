const { spawn } = require('node:child_process');

const runProcess = (command) => {
  const commandArr = command.split(/\s/);

  const ls = spawn(commandArr[0], commandArr.slice(1));

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
