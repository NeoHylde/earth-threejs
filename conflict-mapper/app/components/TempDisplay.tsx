import React, { useEffect, useState } from "react";

const TempDisplay = () => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/clusters");
        if (!res.ok) throw new Error(`HTTP error. Status ${res.status}`);
        const text = await res.text();
        setData(text);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      }
    };
    fetchData();
  }, []);

  if (error) return error;
  return data ?? "Loading...";
};

export default TempDisplay;