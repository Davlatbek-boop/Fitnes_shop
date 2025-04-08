const DeviceDetector = require("node-device-detector");
const fs = require("fs").promises; // Asynchronous version of fs module
const path = require("path");
const { errorHandler } = require("../../helpers/error_handler");

const detectors = async (req, res, next) => {
  try {
    const detector = new DeviceDetector();
    const userAgent = req.headers["user-agent"];

    const result = detector.detect(userAgent);
    result.timestamp = new Date().toISOString();
    result.ip = req.ip || req.connection.remoteAddress;
    result.method = req.method;
    result.url = req.originalUrl;

    const filePath = path.join(__dirname, "../../logs/device_info.log");

    // Log ma'lumotlarini faylga asinxron tarzda yozish
    await fs.appendFile(filePath, JSON.stringify(result) + ",\n");

    // Keyingi middleware yoki route handlerga o'tish
    next();
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = detectors;
