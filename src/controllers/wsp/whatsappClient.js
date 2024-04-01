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

console.log("hollaa");

client.on("ready", () => {
  clientReady = true;
  console.log("Client is ready!");
});

// Función para consultar el estado listo
function isClientReady() {
  return clientReady;
}

// Asegúrate de exportar tanto el cliente como la función para verificar su estado
module.exports = { client, isClientReady };