import { toast } from 'sonner'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function http<T>(
  url: string,
  options?: RequestInit & { skipToast?: boolean }
): Promise<T> {
  const method = options?.method || 'GET'
  const skipToast = options?.skipToast || false

  try {
    const res = await fetch(import.meta.env.VITE_API_URL + url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options,
    })

    // Intentional delay of 500ms
    await delay(500)

    if (!res.ok) {
      const errorText = await res.text()
      const errorMessage = errorText || `HTTP Error: ${res.status}`

      if (!skipToast) {
        toast.error('Error', {
          description: errorMessage
        })
      }

      throw new Error(errorMessage)
    }

    const data = await res.json()

    // Show success toast for mutations (POST, PUT, PATCH, DELETE)
    if (!skipToast && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      let message = 'Operación exitosa'

      if (method === 'POST') message = 'Registro creado exitosamente'
      if (method === 'PUT' || method === 'PATCH') message = 'Registro actualizado exitosamente'
      if (method === 'DELETE') message = 'Registro eliminado exitosamente'

      toast.success(message)
    }

    return data
  } catch (error) {
    if (!skipToast && error instanceof Error) {
      toast.error('Error', {
        description: error.message
      })
    }
    throw error
  }
}
