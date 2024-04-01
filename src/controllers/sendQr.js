const { isQrReady } = require("./wsp/imgQr");


const sendQr = (req, res) => {
  if (isQrReady()) {
    res.send(`<img src="${isQrReady()}">`);
  } else {
    res.send("QR Code not available yet.");
  }
};

module.exports = { sendQr };
