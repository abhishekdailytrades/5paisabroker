const express = require("express");
const router = express.Router();
const fivePaisaController = require("../controller/5paisa.controller");

router.get("/", fivePaisaController.login);
router.get("/callback", fivePaisaController.callback);
router.post("/place-order", fivePaisaController.placeOrder);

module.exports = router;