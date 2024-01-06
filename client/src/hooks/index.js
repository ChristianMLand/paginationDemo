import { useState, useEffect } from 'react';

export const useDataFetcher = (service, dependencies=[]) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const controller = new AbortController();
      setLoading(true);
      service(controller).then(res => {
        setData(res);
        setLoading(false);
      });
      return () => {
        controller.abort();
        setLoading(false);
      }
    }, dependencies);

    return [data, loading];
}

export const usePaginate = (service, initialAmountPerPage, total) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [amtPerPage, setAmtPerPage] = useState(initialAmountPerPage);
    let totalPages = Math.ceil(total / amtPerPage);
    const [items, loading] = useDataFetcher(async controller => {
        return await service(amtPerPage, amtPerPage * currentPage, controller)
    },[currentPage, amtPerPage]);
    
    const goToPage = page => {
        setCurrentPage(Math.min(Math.max(0, page), totalPages-1));
    };

    const updateAmtPerPage = amt => {
        totalPages = Math.ceil(total / amt);
        goToPage(Math.floor(amtPerPage * (currentPage+1) / amt)-1);
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