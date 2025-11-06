import type { PaginationFilters } from "../interfaces/filters"
import type { CreateInvoiceDTO, Invoice, PaginatedResponse } from "../types"
import { http } from "../utils/httpClient"

export const getInvoicesList = (filters: PaginationFilters) => {
	const response = http<PaginatedResponse<Invoice>>(
		"/invoices",
		{ method: "GET" },
		filters,
	)

	return response
}

export const createInvoice = (data: CreateInvoiceDTO) => {
	const response = http("/invoices", {
		method: "POST",
		body: JSON.stringify(data),
	})

	return response
}

export const getInvoiceById = (id: number) => {
	const response = http<Invoice>(`/invoices/${id}`, {
		method: "GET",
	})

	return response
}
