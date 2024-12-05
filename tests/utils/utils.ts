const { spawn } = require('node:child_process');

interface IOptions {
  showLog?: boolean;
  showErr?: boolean;
}

const defaultOptions: IOptions = { showLog: true, showErr: true };

const runProcess = (commandString: string, options = defaultOptions) => {
  const [command, ...params] = commandString.split(/\s/);

  const ls = spawn(command, params);

  ls.stdout.on('data', (data: Buffer) => {
    options.showLog && console.log(`${data}`);
  });

  ls.stderr.on('data', (data: Buffer) => {
    options.showErr && console.error('stderr:', `${data}`);
  });

  return new Promise((rv) => {
    ls.on('close', (code: number) => {
      options.showLog && console.log('Exited with code:', `${code}`);
      rv(code);
    });
  });
};

export const runScript = async (script: string, options?: IOptions) => {
  const commands = script.split('\n');
  for (const command of commands) {
    await runProcess(command, options);
  }
};
