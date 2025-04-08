const router = require("express").Router()

const adminRoute = require("./admins.routes")
const cardRoute = require("./cards.routes")
const clientRoute = require("./clients.routes")
const ownerRoute = require("./owners.routes")
const statusRoute = require("./status.routes")
const categoryRoute = require("./categories.routes")
const productRoute = require("./products.routes")
const contractRoute = require("./contracts.routes")
const paymentRoute = require("./payments.routes")
const otpRoute = require("./otp.routes")
const errorRoute = require("./Errors.routes")
const filterRoute = require("./filters.routes")


router.use("/admin", adminRoute)
router.use("/card", cardRoute)
router.use("/client", clientRoute)
router.use("/owner", ownerRoute)
router.use("/status", statusRoute)
router.use("/category", categoryRoute)
router.use("/product", productRoute)
router.use("/contract", contractRoute)
router.use("/payment", paymentRoute)
router.use("/otp", otpRoute)
router.use("/error", errorRoute)
router.use("/filter", filterRoute)



module.exports = router
