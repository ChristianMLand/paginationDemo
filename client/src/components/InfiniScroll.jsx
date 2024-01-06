import { useState, useEffect, useRef } from 'react';
import { usePaginate } from '~/hooks';
import style from './paginator.module.css';

export default function InfiniScroll({ service, batchSize, totalItems, bufferDistance, ItemComponent }) {
    const { 
        items, 
        currentPage, 
        goToPage, 
        totalPages, 
        loading 
    } = usePaginate(service, batchSize, totalItems);
    const [allItems, setAllItems] = useState([]);
    const listElement = useRef(null);
    const scrollPos = useRef(0);

    const handleScroll = () => {
        if (currentPage === totalPages - 1 || allItems.length !== (currentPage+1) * batchSize) return;
        const { scrollTop, scrollHeight, clientHeight } = listElement.current;
        scrollPos.current = scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight - bufferDistance) goToPage(currentPage + 1);
    }

    useEffect(() => {
        setAllItems(current => current.concat(items ?? []));
        listElement.current.scrollTo(0, scrollPos.current);
    }, [items]);

    return (
        <div className={style.container}>
            <h2>Infinite Scroll</h2>
            <ul className={style.itemList} ref={listElement} onScroll={handleScroll}>
                { allItems?.map((item, i) => <ItemComponent key={i} {...item} />)}
            </ul>
            { loading && <h1 className={style.loading}>Loading...</h1> }
        </div>
    )
};