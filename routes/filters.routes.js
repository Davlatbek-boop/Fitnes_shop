const {
  getProductsByDate,
  getClientsByDemages,
  getClientsByRejected,
  countBestOwners,
  paymentsQuery,
} = require("../controllers/filter.controller");

const router = require("express").Router();

router.get("/products/date", getProductsByDate);
router.get("/clients/demages", getClientsByDemages);
router.get("/clients/rejected", getClientsByRejected);
router.get("/top/owners", countBestOwners);
router.get("/payment/query", paymentsQuery)

module.exports = router;
