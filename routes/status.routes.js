const {
  addStatus,
  getAllStatus,
  getStatusById,
  updateStatusById,
  deleteStatusById,
} = require("../controllers/status.controller");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/",tokenGuard, roleGuard(["Admin"]), addStatus);
router.get("/",tokenGuard, roleGuard(["Admin"]), getAllStatus);
router.get("/:id",tokenGuard,roleGuard(["Admin"]), getStatusById);
router.put("/:id",tokenGuard, roleGuard(["Admin"]), updateStatusById);
router.delete("/:id",tokenGuard, roleGuard(["Admin"]), deleteStatusById);

module.exports = router;
