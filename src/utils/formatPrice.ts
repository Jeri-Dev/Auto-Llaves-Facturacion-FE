/**
 * Formatea un valor numérico a moneda dominicana
 * @param value - El valor numérico a formatear
 * @returns String formateado como "RD$ 1,234.56"
 */
export function formatPrice(value: number): string {
  return `RD$ ${value.toLocaleString('es-DO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}
