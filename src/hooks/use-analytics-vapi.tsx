import { useEffect, useState } from "react";

export interface AnalyticsRecord {
  id: number;
  body: string;
  created_at: string;
}

export function useAnalyticsVapi() {
  const [records, setRecords] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/analytics", { method: "GET" });
        const data = await res.json();
        if (res.ok && Array.isArray(data.records)) {
          setRecords(data.records);
        } else {
          setError(data.error || "Veri alınamadı");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return { records, loading, error };
}
