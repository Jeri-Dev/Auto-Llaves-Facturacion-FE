import { http } from "../utils/httpClient"
import type {
	TodaySalesResponse,
	MonthSalesResponse,
	YearlySalesResponse,
	SalesByDayResponse,
	CreateSaleDTO,
	Sale,
} from "../types/sales"
import type { PaginationFilters } from "../interfaces/filters"

const BASE_URL = "/sales"

// Get today's sales
export async function getTodaySales(): Promise<TodaySalesResponse> {
	return http<TodaySalesResponse>(`${BASE_URL}/today`)
}

// Get current month sales with comparison
export async function getMonthSales(): Promise<MonthSalesResponse> {
	return http<MonthSalesResponse>(`${BASE_URL}/month`)
}

// Get yearly sales (last 12 months)
export async function getYearlySales(): Promise<YearlySalesResponse> {
	return http<YearlySalesResponse>(`${BASE_URL}/yearly`)
}

// Get sales grouped by day with pagination
export async function getSalesByDay(
	filters?: PaginationFilters,
): Promise<SalesByDayResponse> {
	return http<SalesByDayResponse>(`${BASE_URL}/by-day`, undefined, filters)
}

// Create a new sale
export async function createSale(data: CreateSaleDTO): Promise<Sale> {
	return http<Sale>(BASE_URL, {
		method: "POST",
		body: JSON.stringify(data),
	})
}

// Delete a sale
export async function deleteSale(id: number): Promise<void> {
	return http<void>(`${BASE_URL}/${id}`, {
		method: "DELETE",
	})
}
