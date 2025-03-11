// const formidable = require("formidable");
// const xlsx = require("xlsx");
const { isClientReady, client } = require("./wsp/whatsappClient");
const numberToHour = require("../utils/numberToHour");
const {
  formatDate,
  addDaysToDate,
  excelSerialDateToJSDate,
  getDayOfWeek,
} = require("../utils/dateFuncts");
const { delay } = require("../utils/delay");
const {
  messageStatus,
  messageOp,
  processMessageOp,
} = require("./message/messageOption");

const processPhoneNumber = (phoneField) => {
  if (!phoneField) return null;
  // const phones = phoneField.split("//");
  if (typeof phoneField === "number") {
    return phoneField.toString();
  }

  const regex = /\b\d{2,4}[-\s]?\d{3,4}[-\s]?\d{0,4}\b/g;

  // Usamos match para obtener todos los números que coinciden con el regex
  const phones = phoneField.match(regex);
  let number = "";
  for (const phone of phones) {
    const phoneNum = phone.toString().replace(/\D/g, "");
    if (phoneNum.length >= 8) {
      // if (phoneNum.length === 8 && phoneNum.startsWith("15")) {
      //   const cleanNumber = phoneNum.substring(2);
      //   number = "3544" + cleanNumber;
      // } else {
      //   number = phoneNum;
      // }

      // Chequear si el número tiene el formato 15XXXXXXXX (8 dígitos comenzando con 15)
      if (/^15\d{6}$/.test(phoneNum)) {
        // Reemplaza '15' con '3544'
        number = "3544" + phoneNum.substring(2);
      }

      // Chequear si el número tiene el formato 354415XXXXXXXX
      else if (/^354415\d{6}$/.test(phoneNum)) {
        // Elimina el '15'
        number = "3544" + phoneNum.substring(6);
      } else {
        number = phoneNum;
      }
    }
  }
  return number;
};

function capitalizeWords(str) {
  if (!str) {
    return "Nombre";
  }
  return str.toLowerCase().replace(/\b\w/g, function (letter) {
    return letter.toUpperCase();
  });
}
function capitalizeWordsDoctor(str) {
  if (!str) {
    return "La Dra";
  }
  str = str.toLowerCase(); // Asignar a str después de convertirlo a minúsculas
  let before = "";

  if (
    str.includes("meyer") ||
    str.includes("iribarren") ||
    str.includes("cuello") ||
    str.includes("pegoraro")
  ) {
    before = "el Dr. "; // Asumimos que es un doctor
  } else if (str.includes("bort")) {
    // Esto está repetido
    before = "la técnica "; // Asegúrate de que esta condición sea necesaria
  } else {
    before = "la Dra. "; // Por defecto, es una doctora
  }

  return (
    before +
    str.replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    })
  );
}

function handleEstudios(dr) {
  if (!dr) {
    return "";
  } else {
    dr = dr.toLowerCase(); // Asignar a str después de convertirlo a minúsculas
    if (dr.includes("lopez") || dr.includes("bort")) {
      return "para unos estudios ";
    } else {
      return "";
    }
  }
}

function reFormatDate(date) {
  const jsDate = excelSerialDateToJSDate(date);
  const formattedDate = formatDate(jsDate);

  return formattedDate;
}

const sendWsp = async (data, messageTemplate) => {
  console.log(data);
  try {
    for (const item of data) {
      if (!messageStatus()) {
        return;
      }

      processMessageOp(true);

      if (
        !item.__EMPTY_6 ||
        item.__EMPTY_6.toString().replace(/\D/g, "") === ""
      ) {
        if (item.__EMPTY_6) {
          console.log("No hay número de teléfono válido para:", item.__EMPTY_2);
        }
        continue;
      }
      try {
        const numberFormated = processPhoneNumber(item.__EMPTY_6);
        const number = `549${numberFormated
          .toString()
          .replace(/\D/g, "")}@c.us`;

        const jsDate = excelSerialDateToJSDate(item.fecha);
        let jsDateNew = new Date();
        if (item.__EMPTY_12) {
          jsDateNew = excelSerialDateToJSDate(item.__EMPTY_12);
        }
        // const formattedDate = formatDate(jsDate);

        let message = messageTemplate
          .replace(/{paciente}/g, capitalizeWords(item.__EMPTY_2))
          .replace(/{hora}/g, numberToHour(item.__EMPTY))
          .replace(/{nueva hora}/g, numberToHour(item.__EMPTY_13))
          .replace(/{profesional}/g, capitalizeWordsDoctor(item.doctor))
          // .replace(/{fecha}/g, formattedDate)
          .replace(/{dia}/g, getDayOfWeek(jsDate))
          .replace(/{nuevo dia}/g, getDayOfWeek(jsDateNew))
          .replace(/{fecha}/g, reFormatDate(item.fecha))
          .replace(/{fecha \+ (\d+)}/g, (match, days) =>
            formatDate(addDaysToDate(Number(days)))
          )
          .replace(/{nueva fecha}/g, reFormatDate(item.__EMPTY_12))
          .replace(
            /{pami}/g,
            item.__EMPTY_3 !== "PAMI"
              ? ""
              : `\n📱 Por favor, traiga la última versión de su documento y, si es posible, descargue la aplicación de PAMI en su dispositivo móvil para facilitar la atención. Puede descargarla aquí: https://play.google.com/store/apps/details?id=ar.org.pami.app.\n`
          )
          .replace(/{estudios} /g, handleEstudios(item.doctor));
        console.log(number, "number");
        console.log(message);

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
