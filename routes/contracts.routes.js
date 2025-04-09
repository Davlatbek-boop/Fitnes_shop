const {
  addContract,
  getAllContract,
  getContractById,
  updateContractById,
  deleteContractById,
  getAllCardByClientId,
  getContractByClientId,
  getContractByOwnerId,
  getContractByClientIdAndContractId,
  getContractByOwnerIdAndContractId,
} = require("../controllers/contracts.controller");
const clientSelfGuard = require("../middleware/guards/client.self.guard");
const ownerSelfGuard = require("../middleware/guards/owner.self.guard");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/", tokenGuard, addContract);
router.get("/all/contract/:id",tokenGuard, clientSelfGuard, getAllCardByClientId )
router.get("/", tokenGuard, roleGuard(["Admin", "creator"]), getAllContract);
router.get("/client/:id/contract/:contractId", getContractByClientIdAndContractId)
router.get("/client/:id/contracts", getContractByClientId)
router.get("/owner/:id/contract/:contractId", getContractByOwnerIdAndContractId)
router.get("/owner/:id/contracts", getContractByOwnerId)


 
router.get(
  "/owner/:id",
  tokenGuard,
  ownerSelfGuard,
  getContractById
);
router.get(
  "/client/:id",
  tokenGuard,
  clientSelfGuard,
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
