import { create } from "zustand"
import type { Invoice, CreateInvoiceDTO, PaginatedResponse, PaginationMetadata } from "../types"
import { http } from "../utils/httpClient"

interface InvoiceFilters {
	page?: number
	max?: number
	search?: string
	startDate?: string
	endDate?: string
	orderSort?: 'asc' | 'desc'
}

interface InvoiceState {
	invoices: Invoice[]
	metadata: PaginationMetadata | null
	loading: boolean
	error: string | null
	fetchInvoices: (filters?: InvoiceFilters) => Promise<void>
	getInvoiceById: (id: number) => Promise<Invoice>
	createInvoice: (data: CreateInvoiceDTO) => Promise<Invoice>
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
	invoices: [],
	metadata: null,
	loading: false,
	error: null,

	fetchInvoices: async (filters?: InvoiceFilters) => {
		set({ loading: true, error: null })
		try {
			const params = new URLSearchParams()
			if (filters?.page) params.append('page', filters.page.toString())
			if (filters?.max) params.append('max', filters.max.toString())
			if (filters?.search) params.append('search', filters.search)
			if (filters?.startDate) params.append('startDate', filters.startDate)
			if (filters?.endDate) params.append('endDate', filters.endDate)
			if (filters?.orderSort) params.append('orderSort', filters.orderSort)

			const queryString = params.toString()
			const url = queryString ? `/invoices?${queryString}` : '/invoices'

			const response = await http<PaginatedResponse<Invoice>>(url, { skipToast: true })
			console.log("Fetched invoices:", response)
			set({ invoices: response.data, metadata: response.metadata, loading: false })
		} catch (error) {
			set({ error: (error as Error).message, loading: false })
		}
	},

	getInvoiceById: async (id: number) => {
		set({ loading: true, error: null })
		try {
			const invoice = await http<Invoice>(`/invoices/${id}`)
			set({ loading: false })
			return invoice
		} catch (error) {
			set({ error: (error as Error).message, loading: false })
			throw error
		}
	},

	createInvoice: async (data: CreateInvoiceDTO) => {
		set({ loading: true, error: null })
		try {
			const invoice = await http<Invoice>("/invoices", {
				method: "POST",
				body: JSON.stringify(data),
			})
			set((state) => ({
				invoices: [...state.invoices, invoice],
				loading: false,
			}))
			return invoice
		} catch (error) {
			set({ error: (error as Error).message, loading: false })
			throw error
		}
	},
}))
