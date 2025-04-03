import { app, BrowserWindow } from 'electron';
import process from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logPath = `${__dirname}/log.txt`;

function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

killProcessOnPort(3000);
killProcessOnPort(5173);

log('Starting application...');

const back = process.spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe', // use 'pipe' to capture stdout and stderr
  shell: true
});

back.stdout.on('data', (data) => {
  log(`Backend stdout: ${data}`);
});

back.stderr.on('data', (data) => {
  log(`Backend stderr: ${data}`);
});

back.on('error', (err) => {
  log(`Backend process error: ${err}`);
});

back.on('exit', (code, signal) => {
  log(`Backend process exited with code ${code} and signal ${signal}`);
});

const front = process.spawn('npx', ['vite'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'pipe', // use 'pipe' to capture stdout and stderr
  shell: true
});

front.stdout.on('data', (data) => {
  log(`Frontend stdout: ${data}`);
});

front.stderr.on('data', (data) => {
  log(`Frontend stderr: ${data}`);
});

front.on('error', (err) => {
  log(`Frontend process error: ${err}`);
});

front.on('exit', (code, signal) => {
  log(`Frontend process exited with code ${code} and signal ${signal}`);
});

const createWindow = () => {
  log('Creating window...');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //SQLite interaction w/the Electron renderer
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL('http://localhost:5173').then(() => {
    log('Loaded URL: http://localhost:5173');
  }).catch(err => {
    log(`Failed to load URL: ${err}`);
  });
};

app.whenReady().then(() => {
  log('App is ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Stop front and backend servers
    back.kill('SIGTERM');
    front.kill('SIGTERM');

    // Kill all node processes and wait for completion
    Promise.all([
      new Promise((resolve) => killProcessOnPort(3000, resolve)),
      new Promise((resolve) => killProcessOnPort(5173, resolve)),
      new Promise((resolve) => {
        process.exec('taskkill /IM node.exe /F', (err, stdout, stderr) => { //kill node.exe
          if (err || stderr) {
            log(`Error killing all Node.js processes: ${err || stderr}`);
          } else {
            log('Successfully killed all Node.js processes');
          }
          resolve();
        });
      })
    ]).then(() => {
      log('All processes terminated. Exiting application.');
      app.quit();
    });
  }
});

// kill process using port
function killProcessOnPort(port, callback) {
  process.exec(`netstat -ano | findstr :${port}`, (err, stdout, stderr) => {
    if (err || stderr) {
      log(`Error finding process on port ${port}: ${err || stderr}`);
      if (callback) callback(); // Ensure callback is called even on error
      return;
    }

    const lines = stdout.trim().split('\n');
    if (lines.length === 0 || !lines[0].trim()) {
      log(`No process found on port ${port}`);
      if (callback) callback(); // Ensure callback is called if no process is found
      return;
    }

    const pid = lines[0].trim().split(/\s+/).pop();
    if (!pid || pid === '0') {
      log(`Invalid PID (${pid}) found for port ${port}`);
      if (callback) callback(); // Ensure callback is called for invalid PID
      return;
    }

    process.exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) => {
      if (err || stderr) {
        log(`Error killing process with PID ${pid}: ${err || stderr}`);
      } else {
        log(`Successfully killed process with PID ${pid} on port ${port}`);
      }
      if (callback) callback(); // Ensure callback is called after taskkill
    });
  });
}