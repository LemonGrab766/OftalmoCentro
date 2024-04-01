const { Router } = require("express");
const { sendWsp } = require("../controllers/sendWsp");
const { sendQr } = require("../controllers/sendQr");
const { confirmServer } = require("../controllers/confirmSever");

const router = Router();

router.get("/qr", sendQr);
router.post("/send-messages", sendWsp);
router.head("/server", confirmServer)

module.exports = router;
