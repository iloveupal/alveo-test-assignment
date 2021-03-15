const LOG_FILE = './log.txt';
const POLL_TIMEOUT = 20000;

const fs = require('fs');
const express = require('express');
const md5File = require('md5-file');
const cors = require('cors');
const chokidar = require('chokidar');
const { EventEmitter } = require('events');

const app = express();

app.use(cors());

function logsServiceFactory (logFilePath) {
  let watcher = null;
  let currentMd5 = null;
  let fileChangedEventEmitter = new EventEmitter();

  const watcherCallback = async () => {
    currentMd5 = await md5File(logFilePath);
    fileChangedEventEmitter.emit('change', currentMd5);
  };
  
  const start = () => {
    if (!watcher) {
      watcher = chokidar.watch(logFilePath);
      watcher.on('change', watcherCallback);
    }
  };

  const stop = async () => {
    if (watcher) {
      watcher.off('change', watcherCallback);
      await watcher.close();
      watcher = null;
    }
  };

  const getCurrentMd5 = async () => {
    if (!currentMd5) {
      currentMd5 = await md5File(logFilePath);
    }

    return currentMd5;
  };

  return {
    start, stop, fileChangedEventEmitter, getCurrentMd5,
  };
}

const logsService = logsServiceFactory(LOG_FILE);

logsService.start();

const createLogsResponse = (logs) => ({
  logs,
  newLogsAvailable: true,
});

const createPollTimeoutResponse = () => ({
  newLogsAvailable: false,
});

app.get('/logs', async (req, res) => {
  if (req.header('If-None-Match') !== await logsService.getCurrentMd5()) {
    fs.readFile(LOG_FILE, { encoding: 'utf-8' }, async (err, data) => {
      res.setHeader('ETag', await logsService.getCurrentMd5());
      res.json(createLogsResponse(data.split('\n')));
    });
  } else {
    Promise.race([
      new Promise((resolve) => {
        logsService.fileChangedEventEmitter.once('change', resolve);
      }),
      new Promise((resolve, reject) => {
        setTimeout(reject, POLL_TIMEOUT);
      })
    ]).then(() => {
      fs.readFile(LOG_FILE, { encoding: 'utf-8' }, async (err, data) => {
        res.setHeader('ETag', await logsService.getCurrentMd5());
        res.json(createLogsResponse(data.split('\n')));
      });
    }).catch(() => {
      res.json(createPollTimeoutResponse());
    })
  }
});

app.listen(3001);
