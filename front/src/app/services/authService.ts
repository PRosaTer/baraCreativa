
import { RegisterApiData, ApiResponse } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const registerUser = async (userData: RegisterApiData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "No se pudo parsear el error del servidor." }));
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