import { create } from 'zustand'
import type { Company, RncData, CreateCompanyDTO, UpdateCompanyDTO } from '../types'
import { http } from '../utils/httpClient'

interface CompanyState {
  company: Company | null
  loading: boolean
  error: string | null
  fetchCurrentCompany: () => Promise<void>
  createCompany: (data: CreateCompanyDTO) => Promise<Company>
  updateCompany: (id: number, data: UpdateCompanyDTO) => Promise<Company>
  getRncData: (rnc: string) => Promise<RncData>
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  loading: false,
  error: null,

  fetchCurrentCompany: async () => {
    set({ loading: true, error: null })
    try {
      const company = await http<Company>('/company/current')
      set({ company, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createCompany: async (data: CreateCompanyDTO) => {
    set({ loading: true, error: null })
    try {
      const company = await http<Company>('/company', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      set({ company, loading: false })
      return company
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateCompany: async (id: number, data: UpdateCompanyDTO) => {
    set({ loading: true, error: null })
    try {
      const company = await http<Company>(`/company/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
      set({ company, loading: false })
      return company
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  getRncData: async (rnc: string) => {
    set({ loading: true, error: null })
    try {
      const data = await http<RncData>(`/company/rnc?rnc=${rnc}`)
      set({ loading: false })
      return data
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  }
}))
