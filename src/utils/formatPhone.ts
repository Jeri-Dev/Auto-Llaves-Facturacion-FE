/**
 * Formatea un número de teléfono al formato 809-456-8855
 * @param phone - El número de teléfono (puede contener guiones o no)
 * @returns String formateado como "809-456-8855" o el valor original si no es válido
 */
export function formatPhone(phone: string | undefined | null): string {
  if (!phone) return ''

  // Remover todo excepto números
  const cleaned = phone.replace(/\D/g, '')

  // Si no tiene 10 dígitos, retornar el valor original
  if (cleaned.length !== 10) return phone

  // Formatear como 809-456-8855
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
}

/**
 * Aplica máscara de teléfono mientras el usuario escribe
 * Acepta solo números y formatea automáticamente
 * @param value - El valor actual del input
 * @returns String con máscara aplicada
 */
export function maskPhone(value: string): string {
  // Remover todo excepto números
  const cleaned = value.replace(/\D/g, '')

  // Limitar a 10 dígitos
  const limited = cleaned.slice(0, 10)

  // Aplicar máscara progresivamente
  if (limited.length <= 3) {
    return limited
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`
  }
}

/**
 * Extrae solo los números de un teléfono formateado
 * Útil para guardar en la base de datos
 * @param phone - El número de teléfono formateado
 * @returns String con solo números
 */
export function unmaskPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}
