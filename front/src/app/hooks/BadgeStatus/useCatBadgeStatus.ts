import { useState, useEffect } from "react";
import { CatBadgeStatus } from "@/app/types/badge.types";

export const useCatBadgeStatus = (userId: number | null) => {
  const [status, setStatus] = useState<CatBadgeStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setStatus(null);
      return;
    }

    const fetchBadgeStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_URL}/api/logros/cat-badge${userId ? `?userId=${userId}` : ""}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Error al obtener el estado del logro: " + res.statusText);
        }

        const data: CatBadgeStatus = await res.json();
        setStatus(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Ocurrió un error inesperado");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBadgeStatus();
  }, [userId, API_URL]);

  return { status, loading, error };
};
