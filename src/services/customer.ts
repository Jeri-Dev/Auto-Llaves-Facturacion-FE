import type { PaginationFilters } from "../interfaces/filters"
import type { CreateCustomer, Customer, PaginatedResponse } from "../types"
import { http } from "../utils/httpClient"

export const getCustomersList = (filters: PaginationFilters) => {
	const response = http<PaginatedResponse<Customer>>("/customers", {}, filters)

	return response
}

export const getCustomerById = (id: number) => {
	const response = http<Customer>(`/customers/${id}`)
	return response
}

export const createCustomer = (data: CreateCustomer) => {
	const response = http<Customer>("/customers", {
		body: JSON.stringify(data),
		method: "POST",
	})

	return response
}

export const updateCustomer = (id: number, data: CreateCustomer) => {
	const response = http<Customer>(`/customers/${id}`, {
		body: JSON.stringify(data),
		method: "PATCH",
	})

	return response
}
