const { spawn } = require('child_process');

const exePath = './nginx/nginx.exe';
const args = ['arg1', 'arg2', 'arg3'];

const childProcess = spawn(exePath, args);

childProcess.on('error', (error) => {
    console.error(`Error executing the .exe file: ${error}`);
});

childProcess.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
});