const router = require("express").Router();

const {
    createOtp,
    verifyOtp
}= require("../controllers/otp.controller")


router.post("/create", createOtp)
router.post("/verify", verifyOtp)

module.exports = router