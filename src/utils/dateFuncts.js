function addDaysToDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function formatDate(date) {
  date.setHours(date.getHours());
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function excelSerialDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const date_info = new Date(utc_days * 86400000);

  return new Date(date_info.getUTCFullYear(), date_info.getUTCMonth(), date_info.getUTCDate());
}


// function formatDate(date) {
//   let day = date.getDate();
//   let month = date.getMonth() + 1; // Los meses en JavaScript son 0-indexados
//   let year = date.getFullYear();

//   day = day < 10 ? '0' + day : day;
//   month = month < 10 ? '0' + month : month;

//   return `${day}/${month}/${year}`;
// }


module.exports = { addDaysToDate, formatDate, excelSerialDateToJSDate };
