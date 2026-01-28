// Types and Interfaces for Sales Module

export interface Sale {
	id: number
	item: string
	quantity: number
	price: number
	total: number
	createdAt: string
	updatedAt: string
}

// Response from GET /sales/today
export interface TodaySalesResponse {
	totalAmount: number
	salesCount: number
	averageTicket: number
	sales: Sale[]
}

// Response from GET /sales/month
export interface MonthSalesResponse {
	currentMonth: {
		month: string
		year: number
		totalAmount: number
		salesCount: number
		averageTicket: number
		sales: Sale[]
	}
	previousMonth: {
		month: string
		year: number
		totalAmount: number
		salesCount: number
		averageTicket: number
	}
	comparison: {
		growth: number
		growthPercentage: number
		growthStatus: "increase" | "decrease"
	}
}

// Single item from yearly sales
export interface MonthlySale {
	month: string
	year: number
	totalAmount: number
	salesCount: number
}

// Response from GET /sales/yearly
export type YearlySalesResponse = MonthlySale[]

// Single day group from /sales/by-day
export interface SalesByDayGroup {
	date: string
	totalAmount: number
	salesCount: number
	sales: Sale[]
}

// Response from GET /sales/by-day
export interface SalesByDayResponse {
	metadata: {
		total: number
		page: number
		max: number
		totalPages: number
	}
	data: SalesByDayGroup[]
}

// DTO for creating a sale
export interface CreateSaleDTO {
	item: string
	quantity: number
	price: number
	total: number
}
