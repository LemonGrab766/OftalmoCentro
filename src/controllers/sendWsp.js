// const formidable = require("formidable");
// const xlsx = require("xlsx");
const { isClientReady, client } = require("./wsp/whatsappClient");
const numberToHour = require("../utils/numberToHour");
const {
  formatDate,
  addDaysToDate,
  excelSerialDateToJSDate,
} = require("../utils/dateFuncts");
const { delay } = require("../utils/delay");
const {
  messageStatus,
  messageOp,
  processMessageOp,
} = require("./message/messageOption");

const processPhoneNumber = (phoneField) => {
  if (!phoneField) return null;
  const phones = phoneField.split("//");
  let number = "";
  for (const phone of phones) {
    const phoneNum = phone.toString().replace(/\D/g, "");
    if (phoneNum.length >= 8) {
      if (phoneNum.length === 8 && phoneNum.startsWith("15")) {
        const cleanNumber = phoneNum.substring(2);
        number = "3544" + cleanNumber;
      } else {
        number = phoneNum;
      }
    }
  }
  return number;
};

const sendWsp = async (data, messageTemplate) => {
  // console.log(data);
  try {
    for (const item of data) {
      // console.log(item, "item");
      // console.log(messageStatus());
      if (!messageStatus()) {
        return;
      }

      processMessageOp(true);

      if (
        !item.__EMPTY_11 ||
        item.__EMPTY_11.toString().replace(/\D/g, "") === ""
      ) {
        if (item.__EMPTY_11) {
          console.log("No hay número de teléfono válido para:", item.__EMPTY_3);
        }
        continue;
      }
      try {
        const number2 = processPhoneNumber(item.__EMPTY_11);
        console.log(number2, "number");
        console.log(item.__EMPTY_3);
        // console.log(item.__EMPTY_11);
        const number = `549${item.__EMPTY_11
          .toString()
          .replace(/\D/g, "")}@c.us`;

        const jsDate = excelSerialDateToJSDate(data[2].__EMPTY_6);
        console.log(jsDate);
        const formattedDate = formatDate(jsDate);
        console.log(formattedDate);
        let message = messageTemplate
          .replace(/{paciente}/g, item.__EMPTY_3)
          .replace(/{hora}/g, numberToHour(item.__EMPTY))
          .replace(/{profesional}/g, data[2].__EMPTY_14)
          .replace(/{fecha}/g, formattedDate)
          .replace(/{fecha \+ (\d+)}/g, (match, days) =>
            formatDate(addDaysToDate(Number(days)))
          );

        console.log(message);

        // await client.sendMessage(number, message);

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
  // if (!isClientReady()) {
  //   return res
  //     .status(503)
  //     .json({ message: "El cliente de WhatsApp no está listo" });
  // }

  if (!messageStatus()) {
    messageOp(true);
  }

  // console.log(req.body);

  const { data, messageTemplate } = req.body;

  // const form = new formidable.IncomingForm();
  // const parseForm = () => {
  //   return new Promise((resolve, reject) => {
  //     form.parse(req, (err, fields, files) => {
  //       if (err) reject(err);
  //       resolve({ files, fields });
  //     });
  //   });
  // };
  // const files = await parseForm();
  // const file = files.files.file;
  // let messageTemplate = files.fields.message[0];

  // const workbook = xlsx.readFile(file[0].filepath);
  // const sheetName = workbook.SheetNames[0];
  // const sheet = workbook.Sheets[sheetName];
  // const data = xlsx.utils.sheet_to_json(sheet);

  // const { files, fields } = await parseForm();
  // const file = files.file instanceof Array ? files.file[0] : files.file;
  // let messageTemplate = fields.message[0];
  // const fileExt = file.originalFilename.split(".").pop();
  // let workbook;
  // if (fileExt === "xls") {
  //   // Leer formato antiguo .xls
  //   workbook = xlsx.readFile(file.filepath, {
  //     type: "binary",
  //     bookType: "biff2",
  //   });
  // } else {
  //   // Leer formato .xlsx
  //   workbook = xlsx.readFile(file.filepath);
  // }

  // const sheetName = workbook.SheetNames[0];
  // const sheet = workbook.Sheets[sheetName];
  // const data = xlsx.utils.sheet_to_json(sheet);

  sendWsp(data, messageTemplate)
    .then(() => {
      console.log("Todos los mensajes han sido enviados.");
      processMessageOp(false);
      messageOp(true);
    })
    .catch((error) => {
      processMessageOp(false);
      messageOp(true);
      console.error("Ocurrió un error al enviar los mensajes:", error);
    });

  res
    .status(202)
    .json({ message: "El proceso de envío de mensajes ha comenzado." });
};

module.exports = { sendWspInBackground };
