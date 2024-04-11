const { Client, LocalAuth } = require("whatsapp-web.js");
let clientReady = false;

const wwebVersion = "2.2407.3";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
  },
  webVersionCache: {
    type: "remote",
    remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
  },
});

client.on("ready", () => {
  clientReady = true;
  console.log("Client is ready!");
});

client.on("disconnected", (reason) => {
  clientReady = false;
  console.log(`Client was disconnected! Reason: ${reason}`);
  client.destroy().then(() => client.initialize());
});

// Para manejar la falla de autenticación
client.on("auth_failure", (message) => {
  clientReady = false;
  console.error(`Authentication failed: ${message}`);
  client.destroy().then(() => client.initialize());
});

function isClientReady() {
  return clientReady;
}

module.exports = { client, isClientReady };
