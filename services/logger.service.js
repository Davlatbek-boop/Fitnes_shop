const pino = require('pino');
const fs = require('fs');
const path = require('path');
const pinoms = require('pino-multi-stream');
const ExpressPinoLogger = require('express-pino-logger');

// Log papkasi
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);  // Papkani yaratish
}

// Log fayllari
const errorLogFile = path.join(logDir, 'error.log');
const infoLogFile = path.join(logDir, 'info.log');
const debugLogFile = path.join(logDir, 'debug.log');

// Multi-stream uchun konfiguratsiya
const streams = [
  { level: 'error', stream: fs.createWriteStream(errorLogFile, { flags: 'a' }) }, // Error loglar
  { level: 'info', stream: fs.createWriteStream(infoLogFile, { flags: 'a' }) },   // Info loglar
  { level: 'debug', stream: fs.createWriteStream(debugLogFile, { flags: 'a' }) }, // Debug loglar
];

const exceptionStream = fs.createWriteStream(path.join(logDir, 'exceptions.log'), { flags: 'a' });
const exceptionLogger = pino({}, exceptionStream);

// Unhandled exception
process.on('uncaughtException', (err) => {
  exceptionLogger.error({ msg: 'Uncaught Exception', err });
  process.exit(1);
});

// Unhandled rejection
process.on('unhandledRejection', (reason, promise) => {
  exceptionLogger.error({ msg: 'Unhandled Rejection', reason });
});

// Loggerni yaratish
const logger = pinoms({streams: streams})

// express-pino-logger konfiguratsiyasi
const logsFunction = ExpressPinoLogger({
  logger, // loggerni ulash
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      user: req.raw.user, // Agar `user` ma'lumotlari mavjud bo'lsa
    }),
  },
});

module.exports = { logger, logsFunction };
