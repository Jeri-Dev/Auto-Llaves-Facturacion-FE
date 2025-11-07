import type { PaginationFilters } from "../interfaces/filters"
import type { CreateInventoryDTO, Inventory, InventoryItem, PaginatedResponse, UpdateInventoryDTO } from "../types"
import { http } from "../utils/httpClient"

export interface InventorySearchFilters extends PaginationFilters {
	search?: string
}

export const getInventoryList = (filters: InventorySearchFilters = {}) => {
	const response = http<PaginatedResponse<Inventory>>("/inventory", {}, filters)
	return response
}

export const getInventoryById = (id: number) => {
	const response = http<Inventory>(`/inventory/${id}`)
	return response
}

export const getInventoryByCode = (code: string) => {
	const response = http<InventoryItem>(`/inventory/code/${code}`)
	return response
}

export const createInventory = (data: CreateInventoryDTO) => {
	const response = http<Inventory>("/inventory", {
		body: JSON.stringify(data),
		method: "POST",
	})
	return response
}

export const updateInventory = (id: number, data: UpdateInventoryDTO) => {
	const response = http<Inventory>(`/inventory/${id}`, {
		body: JSON.stringify(data),
		method: "PUT",
	})
	return response
}

export const deleteInventory = (id: number) => {
	const response = http<void>(`/inventory/${id}`, {
		method: "DELETE",
	})
	return response
}
