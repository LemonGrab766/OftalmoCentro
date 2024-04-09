const formidable = require("formidable");
const xlsx = require("xlsx");
const { isClientReady, client } = require("./wsp/whatsappClient");
const numberToHour = require("../utils/numberToHour");
const { formatDate, addDaysToDate } = require("../utils/dateFuncts");
const { delay } = require("../utils/delay");

const sendWsp = async (data, messageTemplate) => {
  try {
    for (const item of data) {
      if (!item["Tel."] || item["Tel."].toString().replace(/\D/g, "") === "") {
        console.log("No hay número de teléfono válido para:", item.Paciente);
        continue;
      }
      try {
        const number = `549${item["Tel."].toString().replace(/\D/g, "")}@c.us`;
        let message = messageTemplate
          .replace(/{paciente}/g, item.Paciente)
          .replace(/{hora}/g, numberToHour(item.Hora))
          .replace(/{profesional}/g, data[0].Profesional)
          .replace(/{fecha}/g, formatDate(new Date()))
          .replace(/{fecha \+ (\d+)}/g, (match, days) =>
            formatDate(addDaysToDate(Number(days)))
          );

        await client.sendMessage(number, message);

        const delays = [
          14005, 14200, 14550, 14890, 15000, 15123, 15345, 15567, 15888, 16000,
          16234, 16555, 16789, 17000, 17222, 17500, 17777, 17999, 18000, 18333,
        ];
        const randomDelay = delays[Math.floor(Math.random() * delays.length)];

        await delay(randomDelay);
      } catch (error) {
        console.log("Number:", item["Tel."]);
        console.log(error.message);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const sendWspInBackground = async (req, res) => {
  if (!isClientReady()) {
    return res
      .status(503)
      .json({ message: "El cliente de WhatsApp no está listo" });
  }

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
  let messageTemplate = files.fields.message[0];

  const workbook = xlsx.readFile(file[0].filepath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  sendWsp(data, messageTemplate)
    .then(() => {
      console.log("Todos los mensajes han sido enviados.");
    })
    .catch((error) => {
      console.error("Ocurrió un error al enviar los mensajes:", error);
    });

  res
    .status(202)
    .json({ message: "El proceso de envío de mensajes ha comenzado." });
};

module.exports = { sendWspInBackground };
