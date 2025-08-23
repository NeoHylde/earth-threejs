import React, { useEffect, useState } from "react";

const TempDisplay: React.FC = () => {
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

  if (error) return <h1>Error: {error}</h1>;
  return <h1 className="bg-white">{data ?? "Loading..."}</h1>;
};

export default TempDisplay;