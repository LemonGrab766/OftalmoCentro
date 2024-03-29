const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const xlsx = require("xlsx");
const cors = require("cors");
const formidable = require("formidable");
const numberToHour = require("./utils/numberToHour");

const port = process.env.PORT || 3001;
let clientReady = false;

const app = express();
app.use(cors());

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one",
  }),
});

client.on("ready", () => {
  clientReady = true;
  console.log("Client is ready!");
});

client.initialize();

// client.on("qr", (qr) => {
//   qrcode.generate(qr, { small: true });
// });

let qrCodeSvg;

client.on("qr", (qr) => {
  // Genera el código QR como una imagen SVG
  qrcode.toDataURL(qr, { type: 'image/svg+xml' }, function (err, url) {
    qrCodeSvg = url;
  });
});

console.log(qrCodeSvg);
// Ruta para mostrar el código QR
app.get('/qr', (req, res) => {
  if(qrCodeSvg) {
    res.send(`<img src="${qrCodeSvg}">`);
  } else {
    res.send("QR Code not available yet.");
  }
});

app.post("/send-messages", express.json(), async (req, res) => {
  if (!clientReady) {
    return res
      .status(503)
      .json({ message: "El cliente de WhatsApp no está listo" });
  }
  try {
    const form = new formidable.IncomingForm();
    const parseForm = () => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ files, fields });
        });
      });
    };
    const files = await parseForm();
    const file = files.files.file;
    let message = files.fields.message[0];

    const workbook = xlsx.readFile(file[0].filepath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(data); // Aquí tienes tus datos

    function addDaysToDate(days) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    }

    // Función para formatear la fecha en el formato dd/mm/AAAA
    function formatDate(date) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Los meses son 0-indexados
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    data.forEach(({ Hora, Nombre, Numero }) => {
      const number = `${"549" + Numero}@c.us`;
      message = message.replace(/{paciente}/g, Nombre);
      message = message.replace(/{hora}/g, numberToHour(Hora));
      message = message.replace(/{profecional}/g, data[0].Profeciona);
      message = message.replace(/{fecha}/g, formatDate(new Date()));

      message = message.replace(/{fecha \+ (\d+)}/g, (match, days) => {
        return formatDate(addDaysToDate(Number(days)));
      });

      client
        .sendMessage(number, message)
        .then((response) => {
          console.log(`Mensaje enviado a ${Nombre}`);
          //   console.log(`respuesta:`, response);
        })
        .catch((err) => {
          console.error(`Error al enviar mensaje a ${Nombre}`, err);
        });
    });

    res.status(200).json({ message: "Mensajes enviados" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`port runing in http://localhost:${port}`);
});
