import { app, BrowserWindow } from 'electron';
import process from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logPath = `${__dirname}/log.txt`;

function log(message) {
  fs.appendFileSync(logPath, `${message}\n`);
}

log('Starting application...');

const back = process.spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe', // Change to 'pipe' to capture stdout and stderr
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
  stdio: 'pipe', // Change to 'pipe' to capture stdout and stderr
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

  // Open the DevTools.
  win.webContents.openDevTools();
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
    app.quit();

    // Stop front and backend servers
    back.kill('SIGTERM');
    front.kill('SIGTERM');

    // Kill all node processes
    killProcessOnPort(3000);
    killProcessOnPort(5173);
  }
});

//kills process use port number passed in
function killProcessOnPort(port) {
  process.exec(`netstat -ano | findstr :${port}`, (err, stdout, stderr) => {
    if (err || stderr) {
      log(`Error finding process on port ${port}: ${err || stderr}`);
      return;
    }

    const lines = stdout.trim().split('\n');
    if (lines.length === 0) {
      log(`No process found on port ${port}`);
      return;
    }

    const pid = lines[0].trim().split(/\s+/).pop();
    process.exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) => {
      if (err || stderr) {
        log(`Error killing process with PID ${pid}: ${err || stderr}`);
        return;
      }
      log(`Successfully killed process with PID ${pid} on port ${port}`);
    });
  });
}