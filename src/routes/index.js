const { Router } = require("express");
const { sendWspInBackground } = require("../controllers/sendWsp");
const { sendQr } = require("../controllers/sendQr");
const { confirmServer } = require("../controllers/confirmSever");
const { login } = require("../controllers/user/login");
const { check } = require("../controllers/user/check");
const { cancelMessage } = require("../controllers/message/cancelMessage");
const { statusProcess } = require("../controllers/message/processMessage");

const router = Router();

router.post("/login", login);

router.get("/check", check);

router.get("/qr", sendQr);

router.post("/send-messages", sendWspInBackground);

router.get("/cancel-messages", cancelMessage);

router.get("/process-messages", statusProcess);

router.head("/server", confirmServer);

module.exports = router;
