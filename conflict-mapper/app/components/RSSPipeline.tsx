import React, { useEffect, useState } from "react";
import { StringController } from "three/examples/jsm/libs/lil-gui.module.min.js";

type Article = {
  link: string;
  pubDate: string;
  source: string;
  title: string;
};

type Clusters = Record<string, Article[]>;

const RSSPipeline = () => {
  const [data, setData] = useState<Clusters | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/clusters");
        if (!res.ok) throw new Error(`HTTP error. Status ${res.status}`);
        const json = await res.json();
        setData(json.items?.clusters ?? json.clusters?? {});
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      }
    };
    fetchData();
  }, []);

  if (error) return error;

  if(!data) return null;

  return data ?? "Loading...";
};

export default RSSPipeline;