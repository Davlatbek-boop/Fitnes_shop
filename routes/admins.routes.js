const {
  addAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshTokenAdmin,
  updatePasswordAdminById ,
} = require("../controllers/admins.controller");
const adminSelfGuard = require("../middleware/guards/admin.self.guard");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/", tokenGuard, roleGuard(["creator"]), addAdmin);
router.post("/login", loginAdmin);
router.post("/uppass/:id",tokenGuard, adminSelfGuard, updatePasswordAdminById)
router.get("/logout",tokenGuard, logoutAdmin);
router.get("/refreshtoken", refreshTokenAdmin);
router.get("/",tokenGuard, roleGuard(["creator"]), getAllAdmins);
router.get("/:id",tokenGuard, adminSelfGuard, getAdminById);
router.put("/:id",tokenGuard, adminSelfGuard, updateAdminById);
router.delete("/:id",tokenGuard, roleGuard(["creator"]), deleteAdminById);

module.exports = router;
