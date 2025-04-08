const {
  addContract,
  getAllContract,
  getContractById,
  updateContractById,
  deleteContractById,
  getAllCardByClientId,
} = require("../controllers/contracts.controller");
const clientSelfGuard = require("../middleware/guards/client.self.guard");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/", tokenGuard, addContract);
router.get("/all/contract/:id",tokenGuard, clientSelfGuard, getAllCardByClientId )
router.get("/", tokenGuard, roleGuard(["Admin", "creator"]), getAllContract);
router.get(
  "/:id",
  tokenGuard,
  roleGuard(["Admin", "creator"]),
  getContractById
);
router.put(
  "/:id",
  tokenGuard,
  roleGuard(["Admin", "creator"]),
  updateContractById
);
router.delete(
  "/:id",
  tokenGuard,
  roleGuard(["Admin", "creator"]),
  deleteContractById
);

module.exports = router;
