import { useState, useEffect, useMemo } from 'react';

export const useDataFetcher = (service, dependencies = [], fallback = null) => {
  const [data, setData] = useState(fallback);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async signal => {
    try {
      setLoading(true);
      setData(await service(signal, ...dependencies));
    } catch (err) {
      setError(err.message);
      setData(fallback);
      console.error("Error: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, dependencies);

  return { data, error, loading };
};

// eager=true fetches all data at once and then exposes what you need as you need it
// eager=false (the default) fetches data as you need it and exposes it as it loads
export const usePaginate = (service, initialLimit, total, eager = false) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(initialLimit);

  let offset = limit * currentPage;
  let totalPages = Math.ceil(total / limit);
  let realLimit = Math.min(total - offset, limit);

  const { data, loading, error } = useDataFetcher(
    service, 
    eager ? [total] : [realLimit, offset]
  );

  const items = eager ? data?.slice(offset, offset + limit) : data;

  const goToPage = page => {
    setCurrentPage(Math.min(Math.max(0, page), totalPages - 1));
  };

  const updateLimit = amt => {
    totalPages = Math.ceil(total / amt);
    goToPage(Math.floor((offset + 1) / amt));
    setLimit(amt);
  };

  return {
    items,
    loading,
    currentPage,
    goToPage,
    limit,
    updateLimit,
    totalPages,
    error
  };
};