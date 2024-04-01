const { Client, LocalAuth } = require("whatsapp-web.js");
let clientReady = false;

const client = new Client({
  // authStrategy: new LocalAuth(),
  // puppeteer: {
  //   headless: true,
  //   args: [
  //     "--no-sandbox",
  //     "--disable-setuid-sandbox",
  //     "--disable-dev-shm-usage",
  //   ],
  // },
});


client.on("ready", () => {
  clientReady = true;
  console.log("Client is ready!");
});

function isClientReady() {
  return clientReady;
}

module.exports = { client, isClientReady };