const express = require("express");
const config = require("config");
const sequelize = require("./config/db");
const mainRouter = require("./routes/index.routes");
const errorHandling = require("./middleware/errors/error.handling");
const cookieParser = require("cookie-parser");
const client = require("./config/redis");
const { logsFunction } = require("./services/logger.service");
const deviceDetector = require("./middleware/device_detector/device.detector")

const PORT = config.get("port") || 3030;

const app = express();

app.use(logsFunction);

app.use(deviceDetector)

app.use(express.json());

app.use(cookieParser());

app.use("/api", mainRouter);

app.use(errorHandling); 
async function start() {
  try {
    client.connect();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
