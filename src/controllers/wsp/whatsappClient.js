const { default: axios } = require("axios");
const { Client, LocalAuth } = require("whatsapp-web.js");
let clientReady = false;

let wwebVersion = "2.2412.54";

// const currentVersion = "2.2346.52"; // Versión actual o una de respaldo

// const getLatestVersion = async (currentVersion) => {
//   const res = await axios.get(
//     `https://web.whatsapp.com/check-update?version=${currentVersion}&platform=web`
//   );
//   const data = res.data;
//   return data.currentVersion;
// };

// getLatestVersion(currentVersion)
//   .then((latestVersion) => {
//     if (latestVersion) {
//       wwebVersion = latestVersion;
//       console.log(wwebVersion);
//     } else {
//       console.error("No se pudo obtener la versión más reciente.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error al obtener la versión más reciente:", error);
//   });


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
  // webVersion: wwebVersion,
  // webVersionCache: {
  //   type: "remote",
  //   remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
  // },
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
