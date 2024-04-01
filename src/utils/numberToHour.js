function numberToHour(numeroDecimal) {
  const horas = Math.floor(numeroDecimal * 24);
  const minutos = Math.round((numeroDecimal * 24 * 60) % 60);
  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;
}
module.exports = numberToHour;
