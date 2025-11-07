export const InvoiceType = {
	GOVERNMENTAL: "GOVERNMENTAL",
	QUOTE: "QUOTE",
	ENDCONSUMER: "ENDCONSUMER",
	CREDIT: "CREDIT",
	BASIC: "BASIC",
} as const

export type InvoiceType = (typeof InvoiceType)[keyof typeof InvoiceType]

export interface Customer {
	id: number
	name: string
	document: string
	phone?: string
	address?: string
	createdAt: string
}

export interface CreateCustomer {
	name: string
	document: string
	phone?: string
	address?: string
}

export interface InvoiceItem {
	name: string
	price: number
	quantity: number
}

export interface Invoice {
	id: number
	customerId?: number
	customer?: Customer
	customerName?: string
	type: InvoiceType
	document?: string
	ncf?: string
	items: InvoiceItem[]
	subtotal: number
	taxes: number
	total: number
	createdAt: string
}

export interface Company {
	id: number
	name: string
	rnc: string
	address: string
	phoneNumber: string
	secondPhoneNumber?: string
	nextGovernmentalNCF: string
	nextCreditNCF: string
	nextEndConsumerNCF: string
	nextQuoteNumber: string
	createdAt: string
	updatedAt: string
}

export interface RncData {
	rnc: string
	business_name: string
	tradeName?: string
	category?: string
	paymentRegime?: string
	state?: string
}

export interface CreateCustomerDTO {
	name: string
	document: string
	phone?: string
	address?: string
}

export interface UpdateCustomerDTO {
	name?: string
	document?: string
	phone?: string
	address?: string
}

export interface CreateInvoiceDTO {
	customerId?: number
	customerName?: string
	type: InvoiceType
	document?: string
	items: InvoiceItem[]
	createdAt?: string
}

export interface CreateCompanyDTO {
	name: string
	rnc: string
	address: string
	phoneNumber: string
	secondPhoneNumber?: string
	nextGovernmentalNCF: string
	nextCreditNCF: string
	nextEndConsumerNCF: string
	nextQuoteNumber: number
}

export interface UpdateCompanyDTO {
	name?: string
	rnc?: string
	address?: string
	phoneNumber?: string
	secondPhoneNumber?: string
	nextGovernmentalNCF?: string
	nextCreditNCF?: string
	nextEndConsumerNCF?: string
	nextQuoteNumber?: number
}

export interface PaginationMetadata {
	total: number
	page: number
	max: number
	next: boolean
	previous: boolean
	totalPages: number
}

export interface PaginatedResponse<T> {
	metadata: PaginationMetadata
	data: T[]
}

export interface Inventory {
	id: number
	code: string
	name: string
	price: number
	createdAt: string
	updatedAt: string
}

export interface InventoryItem {
	code: string
	name: string
	price: number
}

export interface CreateInventoryDTO {
	code: string
	name: string
	price: number
}

export interface UpdateInventoryDTO {
	code?: string
	name?: string
	price?: number
}
