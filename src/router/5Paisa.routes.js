const express = require("express");
const router = express.Router();
const fivePaisaController = require("../controller/5paisa.controller");

router.get("/login", fivePaisaController);
router.get("/auth/callback", fivePaisaController.callback);
router.post("/place-order", fivePaisaController.placeOrder);

module.exports = router;