export const formatearFecha = (fecha) => {
  if (!fecha) return 'S/A'
  const fechaUTC = new Date(fecha.endsWith('Z') ? fecha : fecha + 'Z')
  // const fechaCaracas = new Date(fechaUTC.getTime() - 4 * 60 * 60 * 1000)
  const fechaCaracas = new Date(fechaUTC.getTime())
  return fechaCaracas.toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
