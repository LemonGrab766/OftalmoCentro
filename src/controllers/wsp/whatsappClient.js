const { Client, LocalAuth } = require("whatsapp-web.js");
let clientReady = false;

const wwebVersion = '2.2407.3';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  },
  webVersionCache: {
    type: 'remote',
    remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
},
});


client.on("ready", () => {
  clientReady = true;
  console.log("Client is ready!");
});

function isClientReady() {
  return clientReady;
}

module.exports = { client, isClientReady };