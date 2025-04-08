const { errorUnhandled } = require("../controllers/errors.controller");

const router = require("express").Router();

router.get("/unhandler", errorUnhandled);

module.exports = router;
