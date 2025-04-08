const {
  addOwner,
  getAllOwners,
  getOwnerById,
  updateOwnerById,
  deleteOwnerById,
  loginOwner,
  logoutOwner,
  refreshTokenOwner,
  activateOwner,
} = require("../controllers/owners.controller");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");
const ownerSelfGuard = require("../middleware/guards/owner.self.guard");

const router = require("express").Router();

router.post("/", addOwner);
router.post("/login", loginOwner);
router.get("/activate/:link", activateOwner);
router.get("/logout", logoutOwner);
router.get("/refreshtoken", refreshTokenOwner);
router.get("/", tokenGuard, roleGuard(["Admin", "creator"]), getAllOwners);
router.get("/:id", tokenGuard, ownerSelfGuard, getOwnerById);
router.put("/:id", tokenGuard, ownerSelfGuard, updateOwnerById);
router.delete(
  "/:id",
  tokenGuard,
  roleGuard(["admin", "creator"]),
  deleteOwnerById
);

module.exports = router;
