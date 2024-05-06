function numberToHour(numeroDecimal) {
  let horas = Math.floor(numeroDecimal * 24);
  let minutos = Math.round((numeroDecimal * 24 * 60) % 60);

  // Corrección: Si los minutos redondeados son 60, ajustar a 0 y aumentar las horas.
  if (minutos === 60) {
    minutos = 0;
    horas += 1;
  }

  return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
}
module.exports = numberToHour;
