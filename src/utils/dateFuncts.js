function addDaysToDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  function formatDate(date) {
    date.setHours(date.getHours() - 3);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  module.exports = {addDaysToDate, formatDate}