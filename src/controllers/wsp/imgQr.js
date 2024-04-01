const qrcode = require("qrcode");
const { client } = require("./whatsappClient");

let qrCodeSvg;


client.on("qr", (qr) => {
  qrcode.toDataURL(qr, { type: "image/svg+xml" }, function (err, url) {
    qrCodeSvg = url;
  });
});

function isQrReady() {
  return qrCodeSvg;
}

module.exports = { isQrReady };
