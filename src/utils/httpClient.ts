import { toast } from "sonner";
import type { PaginationFilters } from "../interfaces/filters";

type BackendError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

const MUTATION_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export async function http<T>(
  url: string,
  options?: RequestInit & { skipToast?: boolean },
  filters?: PaginationFilters
): Promise<T> {
  const method = options?.method?.toUpperCase() ?? "GET";
  const skipToast = options?.skipToast ?? false;
  const isMutation = MUTATION_METHODS.includes(method);

  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.max) params.append("max", filters.max.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.orderSort) params.append("orderSort", filters.orderSort);

  const queryString = params.toString();

  try {
    const res = await fetch(
      import.meta.env.VITE_API_URL +
        url +
        (queryString ? `?${queryString}` : ""),
      {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      }
    );

    if (!res.ok) {
      let errorMessage = `HTTP Error ${res.status}`;

      try {
        const errorBody: BackendError = await res.json();

        if (Array.isArray(errorBody.message)) {
          errorMessage = errorBody.message.join(", ");
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else if (errorBody.error) {
          errorMessage = errorBody.error;
        }
      } catch {
        const text = await res.text();
        if (text) errorMessage = text;
      }

      throw new Error(errorMessage);
    }

    const data: T = await res.json();

    if (!skipToast && isMutation) {
      const successMessages: Record<string, string> = {
        POST: "Registro creado exitosamente",
        PUT: "Registro actualizado exitosamente",
        PATCH: "Registro actualizado exitosamente",
        DELETE: "Registro eliminado exitosamente",
      };

      toast.success(successMessages[method] ?? "Operación exitosa");
    }

    return data;
  } catch (error) {
    if (!skipToast && isMutation && error instanceof Error) {
      toast.error("Error", {
        description: error.message,
      });
    }

    throw error;
  }
}
