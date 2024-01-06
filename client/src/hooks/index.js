import { useState, useEffect } from 'react';

export const useDataFetcher = (service, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async controller => {
    setLoading(true);
    const res = await service(controller);
    setLoading(false);
    return res;
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller).then(setData);
    return () => controller.abort();
  }, dependencies);

  return [data, loading];
}

export const usePaginate = (service, initialAmountPerPage, total) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [amtPerPage, setAmtPerPage] = useState(initialAmountPerPage);

  const [items, loading] = useDataFetcher(controller => {
    return service(amtPerPage, amtPerPage * currentPage, controller);
  }, [currentPage, amtPerPage]);

  let totalPages = Math.ceil(total / amtPerPage);

  const goToPage = page => {
    setCurrentPage(Math.min(Math.max(0, page), totalPages - 1));
  };

  const updateAmtPerPage = amt => {
    totalPages = Math.ceil(total / amt);
    goToPage(Math.floor((amtPerPage * currentPage + 1) / amt));
    setAmtPerPage(amt);
  }

  return {
    items,
    loading,
    currentPage,
    goToPage,
    amtPerPage,
    updateAmtPerPage,
    totalPages,
  };
}