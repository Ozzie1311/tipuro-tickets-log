export const formatearFecha = (fecha) => {
  const fechaUTC = new Date(fecha.endsWith('Z') ? fecha : fecha + 'Z')
  const fechaCaracas = new Date(fechaUTC.getTime() - 4 * 60 * 60 * 1000)
  return fechaCaracas.toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
