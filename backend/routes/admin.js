const express = require("express");
const router = express.Router();
const { ensureAuth, ensureAdmin } = require("../middleware/auth");
const adminController = require("../controllers/admin");

router.use(ensureAuth, ensureAdmin);

router.get("/menu-items", adminController.getMenuItems);
router.post("/menu-items", adminController.createMenuItem);
router.put("/menu-items/:id", adminController.updateMenuItem);

router.get("/orders", adminController.getOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

module.exports = router;
