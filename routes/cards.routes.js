const {
  addCard,
  getAllCards,
  getCardById,
  updateCardById,
  deleteCardById,
  getAllCardByClientId,
} = require("../controllers/cards.controller");
const clientSelfGuard = require("../middleware/guards/client.self.guard");
const roleGuard = require("../middleware/guards/role.guard");
const tokenGuard = require("../middleware/guards/token.guard");

const router = require("express").Router();

router.post("/", tokenGuard, roleGuard(["client"]), addCard);
router.get("/all/cards/:id", tokenGuard, clientSelfGuard, getAllCardByClientId);
router.get("/", tokenGuard, roleGuard(["Admin", "creator"]), getAllCards);
router.get("/:id", tokenGuard, roleGuard(["Admin", "creator"]), getCardById);
router.put("/:id", tokenGuard, roleGuard(["Admin", "creator"]), updateCardById);
router.delete(
  "/:id",
  tokenGuard,
  roleGuard(["Admin", "creator"]),
  deleteCardById
);

module.exports = router;
