const {
  addPayment,
  getAllPayment,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
} = require("../controllers/payments.controller");
const clientSelfGuard = require("../middleware/guards/client.self.guard");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/", tokenGuard, addPayment);
router.get("/", tokenGuard, clientSelfGuard, getAllPayment);
router.get("/:id", tokenGuard, clientSelfGuard, getPaymentById);
router.put(
  "/:id",
  tokenGuard,
  roleGuard(["Admin", "creator"]),
  updatePaymentById
);
router.delete(
  "/:id",
  tokenGuard,
  roleGuard(["Admin", "creator"]),
  deletePaymentById
);

module.exports = router;
