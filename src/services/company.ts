import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from "../types"
import { http } from "../utils/httpClient"

export const getCompany = () => {
	const response = http<Company>("/company/current", { method: "GET" })

	return response
}

export const updateCompany = (data: UpdateCompanyDTO) => {
	const response = http("/company", {
		method: "PATCH",
		body: JSON.stringify(data),
	})

	return response
}

export const createCompany = (data: CreateCompanyDTO) => {
	const response = http("/company", {
		method: "POST",
		body: JSON.stringify(data),
	})

	return response
}
