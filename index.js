// const express = require("express");
// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode");
// const xlsx = require("xlsx");
// const cors = require("cors");
// const formidable = require("formidable");
// const numberToHour = require("./utils/numberToHour");
const server = require("./src/app");

const port = process.env.PORT || 3001;
// let clientReady = false;

// const app = express();
// // app.use(cors());

// const client = new Client({
//   authStrategy: new LocalAuth(),
//   webVersion: "2.2409.2",
//   webVersionCache: {
//     type: "remote",
//     remotePath:
//       "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
//   },
//   puppeteer: {
//     headless: true,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//     ],
//   },
// });

// client.on("ready", () => {
//   clientReady = true;
//   console.log("Client is ready!");
// });

// client.initialize();

// // client.on("qr", (qr) => {
// //   qrcode.generate(qr, { small: true });
// // });

// let qrCodeSvg;

// client.on("qr", (qr) => {
//   qrcode.toDataURL(qr, { type: "image/svg+xml" }, function (err, url) {
//     qrCodeSvg = url;
//   });
// });

// process.on("SIGINT", async () => {
//   console.log("(SIGINT) Shutting down...");
//   await client.destroy();
//   console.log("client destroyed");
//   process.exit(0);
// });

// app.head("/client", (req, res) => {
//   console.log("confirmar sever");
//   if (qrCodeSvg) {
//     res.send(`Client-on`);
//   } else {
//     res.send("Client-off");
//   }
// })

// app.get("/qr", (req, res) => {
//   if (qrCodeSvg) {
//     res.send(`<img src="${qrCodeSvg}">`);
//   } else {
//     res.send("QR Code not available yet.");
//   }
// });

// app.post("/send-messages", express.json(), async (req, res) => {
//   if (!clientReady) {
//     return res
//       .status(503)
//       .json({ message: "El cliente de WhatsApp no está listo" });
//   }
//   try {
//     const form = new formidable.IncomingForm();
//     const parseForm = () => {
//       return new Promise((resolve, reject) => {
//         form.parse(req, (err, fields, files) => {
//           if (err) reject(err);
//           resolve({ files, fields });
//         });
//       });
//     };
//     const files = await parseForm();
//     const file = files.files.file;
//     let message = files.fields.message[0];

//     const workbook = xlsx.readFile(file[0].filepath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     function addDaysToDate(days) {
//       const date = new Date();
//       date.setDate(date.getDate() + days);
//       return date;
//     }

//     function formatDate(date) {
//       const day = date.getDate().toString().padStart(2, "0");
//       const month = (date.getMonth() + 1).toString().padStart(2, "0");
//       const year = date.getFullYear();
//       return `${day}/${month}/${year}`;
//     }

//     const promeseAll = [];

//     data.forEach(({ Hora, Nombre, Numero }) => {
//       const number = `${"549" + Numero}@c.us`;
//       message = message.replace(/{paciente}/g, Nombre);
//       message = message.replace(/{hora}/g, numberToHour(Hora));
//       message = message.replace(/{profesional}/g, data[0].Profesional);
//       message = message.replace(/{fecha}/g, formatDate(new Date()));

//       message = message.replace(/{fecha \+ (\d+)}/g, (match, days) => {
//         return formatDate(addDaysToDate(Number(days)));
//       });

//       promeseAll.push(client.sendMessage(number, message));

//       // client
//       //   .sendMessage(number, message)
//       //   .then((response) => {
//       //     console.log(`Mensaje enviado a ${Nombre}`);
//       //     //   console.log(`respuesta:`, response);
//       //   })
//       //   .catch((err) => {
//       //     console.error(`Error al enviar mensaje a ${Nombre}`, err);
//       //   });
//     });

//     await Promise.all(promeseAll);

//     res.status(200).json({ message: "Mensajes enviados" });
//   } catch (error) {
//     res.status(500).json({ message: "Ha ocurrido un error", error });
//     console.log(error);
//   }
// });

server.listen(port, () => {
  console.log(`port runing in http://localhost:${port}`);
});
