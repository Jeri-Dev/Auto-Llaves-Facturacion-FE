import type { RncData } from "../types"
import { http } from "../utils/httpClient"

export const getRncData = (rnc: string) => {
	const response = http<RncData>(`/miscellaneous/rnc?rnc=${rnc}`, {
		method: "GET",
	})

	return response
}
