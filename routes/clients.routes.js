const {
  addClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
  loginClient,
  logoutClient,
  refreshTokenClient,
  activateClient,
} = require("../controllers/clients.controller");
const { getContractById } = require("../controllers/contracts.controller");
const clientSelfGuard = require("../middleware/guards/client.self.guard");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/", addClient);
router.post("/login", loginClient);
router.get("/activate/:link", activateClient);
router.get("/logout",tokenGuard, clientSelfGuard, logoutClient);
router.get("/refreshtoken", refreshTokenClient);
router.get("/contracts", getContractById)
router.get("/", tokenGuard, roleGuard(["Admin", "creator"]), getAllClients);
router.get("/:id", tokenGuard, clientSelfGuard, getClientById);
router.put("/:id", tokenGuard, clientSelfGuard, updateClientById);
router.delete(
  "/:id",
  tokenGuard,
  roleGuard(["Admin", "creator"]),
  deleteClientById
);

module.exports = router;
