const {
  addProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllCardByOwnerId,
} = require("../controllers/products.controller");
const ownerSelfGuard = require("../middleware/guards/owner.self.guard");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/", tokenGuard, roleGuard(["owner"]), addProduct);
router.get("/all/products/:id", tokenGuard, ownerSelfGuard, getAllCardByOwnerId)
router.get("/", tokenGuard, roleGuard(["Admin", "client"]), getAllProduct);
router.get("/:id", tokenGuard, roleGuard(["Admin"]), getProductById);
router.put("/:id", tokenGuard, roleGuard(["Admin"]), updateProductById);
router.delete("/:id", tokenGuard, roleGuard(["Admin"]), deleteProductById);

module.exports = router;
