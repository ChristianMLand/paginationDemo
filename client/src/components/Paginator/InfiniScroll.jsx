import { useState, useEffect, useRef } from 'react';
import { usePaginate } from '~/hooks';
import style from './paginator.module.css';

export default function InfiniScroll(props) {
  const { 
    service, 
    limit, 
    totalItems, 
    bufferDistance, 
    ItemComponent,
    eager
  } = props;

  const {
    items,
    currentPage,
    goToPage,
    totalPages,
    loading
  } = usePaginate(service, limit, totalItems, eager);

  const [allItems, setAllItems] = useState([]);
  const listElement = useRef(null);

  const handleScroll = () => {
    if (currentPage === totalPages - 1) return;
    if (allItems.length !== (currentPage + 1) * limit) return;

    const { scrollTop, scrollHeight, clientHeight } = listElement.current;

    if (scrollTop + clientHeight >= scrollHeight - bufferDistance) {
      goToPage(currentPage + 1);
    }
  }

  useEffect(() => {
    setAllItems(current => current.concat(items ?? []));
  }, [items]);

  return (
    <div className={style.container}>
      <h2>Infinite Scroll</h2>
      <ul 
        className={style.itemList} 
        ref={listElement} 
        onScroll={handleScroll}
      >
        {allItems?.map((item, i) => <ItemComponent key={i} {...item} />)}
      </ul>
      {(loading || !items) && <h1 className={style.loading}>Loading...</h1>}
    </div>
  )
};