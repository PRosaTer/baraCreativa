import { RegisterApiData, ApiResponse } from "../types/auth";

interface ApiError {
  message?: string;
  [key: string]: unknown;
}

export const registerUser = async (userData: RegisterApiData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      let errorData: ApiError = { message: "No se pudo parsear el error del servidor." };
      try {
        errorData = (await response.json()) as ApiError;
      } catch {
      }
      console.error("API Error (registerUser):", errorData);
      throw new Error(errorData.message || JSON.stringify(errorData) || "Error al registrar al usuario.");
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Network or unexpected error (registerUser):", error);
    throw new Error("No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.");
  }
};
