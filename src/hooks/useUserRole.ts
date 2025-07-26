import { useEffect, useState } from "react";

export function useUserRole() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchRole() {
        try {
          const res = await fetch("/api/profile/role"); // 👈 ruta actualizada
          if (!res.ok) throw new Error("Error fetching role");
  
          const data = await res.json();
          setRole(data.role);
        } catch (err) {
          console.error("Error getting role:", err);
          setRole(null);
        } finally {
          setLoading(false);
        }
      }
  
      fetchRole();
    }, []);
  
    return { role, loading };
  }
  