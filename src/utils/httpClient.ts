import { toast } from "sonner"
import type { PaginationFilters } from "../interfaces/filters"

export async function http<T>(
	url: string,
	options?: RequestInit & { skipToast?: boolean },
	filters?: PaginationFilters,
): Promise<T> {
	const method = options?.method || "GET"
	const skipToast = options?.skipToast || false

	const params = new URLSearchParams()
	if (filters?.page) params.append("page", filters.page.toString())
	if (filters?.max) params.append("max", filters.max.toString())
	if (filters?.search) params.append("search", filters.search)
	if (filters?.startDate) params.append("startDate", filters.startDate)
	if (filters?.endDate) params.append("endDate", filters.endDate)
	if (filters?.orderSort) params.append("orderSort", filters.orderSort)

	const queryString = params.toString()

	try {
		const res = await fetch(
			import.meta.env.VITE_API_URL + url + `?${queryString}`,
			{
				headers: {
					"Content-Type": "application/json",
					...options?.headers,
				},
				...options,
			},
		)

		if (!res.ok) {
			const errorText = await res.text()
			const errorMessage = errorText || `HTTP Error: ${res.status}`

			if (!skipToast) {
				toast.error("Error", {
					description: errorMessage,
				})
			}

			throw new Error(errorMessage)
		}

		const data = await res.json()

		if (!skipToast && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
			let message = "Operación exitosa"

			if (method === "POST") message = "Registro creado exitosamente"
			if (method === "PUT" || method === "PATCH")
				message = "Registro actualizado exitosamente"
			if (method === "DELETE") message = "Registro eliminado exitosamente"

			toast.success(message)
		}

		return data
	} catch (error) {
		if (!skipToast && error instanceof Error) {
			toast.error("Error", {
				description: error.message,
			})
		}
		throw error
	}
}
