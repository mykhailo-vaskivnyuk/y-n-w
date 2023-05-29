const { spawn } = require('node:child_process');

const runProcess = (commandString: string) => {
  const [command, ...params] = commandString.split(/\s/);

  const ls = spawn(command, params);

  ls.stdout.on('data', (data: Buffer) => {
    console.log(`${data}`);
  });

  ls.stderr.on('data', (data: Buffer) => {
    console.error('stderr:', `${data}`);
  });

  return new Promise((rv) => {
    ls.on('close', (code: number) => {
      console.log('Exited with code:', `${code}`);
      rv(undefined);
    });
  });
};

export const runScript = async (script: string) => {
  const commands = script.split('\n');
  for (const command of commands) {
    await runProcess(command);
  }
};
