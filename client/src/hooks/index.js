import { useState, useEffect } from 'react';

export const usePaginate = (service, initialAmountPerPage, total) => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [amtPerPage, setAmtPerPage] = useState(initialAmountPerPage);
    let totalPages = Math.ceil(total / amtPerPage);
    
    const [loading, setLoading] = useState(false);

    const fetchItems = async controller => {
        setLoading(true);
        const { data } = await service({
            signal: controller.signal,
            params: { limit: amtPerPage, offset: amtPerPage * currentPage }
        });
        setLoading(false);
        return data;
    }

    const goToPage = page => {
        setCurrentPage(Math.min(Math.max(0, page), totalPages-1));
    };

    const updateAmtPerPage = amt => {
        totalPages = Math.ceil(total / amt);
        goToPage(Math.floor(amtPerPage * (currentPage+1) / amt)-1);
        setAmtPerPage(amt);
    }

    useEffect(() => {
        const controller = new AbortController();
        fetchItems(controller).then(setItems);
        return () => controller.abort();
    }, [currentPage, amtPerPage]);

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