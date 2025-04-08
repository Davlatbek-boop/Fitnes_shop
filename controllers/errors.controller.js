const { logger } = require("../services/logger.service")


const errorUnhandled = (req, res) => {
    logger.error('Error sahifasi ochildi');
    Promise.reject(new Error("Noto'g'ri va'da!"))
}


module.exports = {
    errorUnhandled,
}