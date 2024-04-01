const formidable = require("formidable");
const xlsx = require("xlsx");
const { isClientReady, client } = require("./wsp/whatsappClient");
const numberToHour = require("../utils/numberToHour");

const sendWsp = async (req, res) => {
  if (!isClientReady()) {
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

    function addDaysToDate(days) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    }

    function formatDate(date) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const promeseAll = [];

    data.forEach(({ Hora, Nombre, Numero }) => {
      const number = `${"549" + Numero}@c.us`;
      message = message.replace(/{paciente}/g, Nombre);
      message = message.replace(/{hora}/g, numberToHour(Hora));
      message = message.replace(/{profesional}/g, data[0].Profesional);
      message = message.replace(/{fecha}/g, formatDate(new Date()));

      message = message.replace(/{fecha \+ (\d+)}/g, (match, days) => {
        return formatDate(addDaysToDate(Number(days)));
      });

      promeseAll.push(client.sendMessage(number, message));

      // client
      //   .sendMessage(number, message)
      //   .then((response) => {
      //     console.log(`Mensaje enviado a ${Nombre}`);
      //     //   console.log(`respuesta:`, response);
      //   })
      //   .catch((err) => {
      //     console.error(`Error al enviar mensaje a ${Nombre}`, err);
      //   });
    });

    await Promise.all(promeseAll);

    res.status(200).json({ message: "Mensajes enviados" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error });
    console.log(error);
  }
};

module.exports = {sendWsp};
