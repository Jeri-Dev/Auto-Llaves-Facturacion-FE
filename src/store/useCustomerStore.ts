import { create } from 'zustand'
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO, PaginatedResponse, PaginationMetadata } from '../types'
import { http } from '../utils/httpClient'

interface CustomerFilters {
  page?: number
  max?: number
  search?: string
  startDate?: string
  endDate?: string
  orderSort?: 'asc' | 'desc'
}

interface CustomerState {
  customers: Customer[]
  metadata: PaginationMetadata | null
  loading: boolean
  error: string | null
  fetchCustomers: (filters?: CustomerFilters) => Promise<void>
  getCustomerById: (id: number) => Promise<Customer>
  createCustomer: (data: CreateCustomerDTO) => Promise<Customer>
  updateCustomer: (id: number, data: UpdateCustomerDTO) => Promise<Customer>
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  metadata: null,
  loading: false,
  error: null,

  fetchCustomers: async (filters?: CustomerFilters) => {
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
      const url = queryString ? `/customers?${queryString}` : '/customers'

      const response = await http<PaginatedResponse<Customer>>(url, { skipToast: true })
      set({ customers: response.data, metadata: response.metadata, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  getCustomerById: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const customer = await http<Customer>(`/customers/${id}`)
      set({ loading: false })
      return customer
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  createCustomer: async (data: CreateCustomerDTO) => {
    set({ loading: true, error: null })
    try {
      const customer = await http<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      set((state) => ({
        customers: [...state.customers, customer],
        loading: false
      }))
      return customer
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateCustomer: async (id: number, data: UpdateCustomerDTO) => {
    set({ loading: true, error: null })
    try {
      const customer = await http<Customer>(`/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
      set((state) => ({
        customers: state.customers.map(c => c.id === id ? customer : c),
        loading: false
      }))
      return customer
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  }
}))
