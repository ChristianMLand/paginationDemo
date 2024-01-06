import { useState, useEffect, useRef } from 'react';
import { usePaginate } from '~/hooks';
import style from './paginator.module.css';

export default function Paginator(props) {
  const {
    service,
    maxPageButtons,
    itemPerPageOptions,
    totalItems,
    ItemComponent
  } = props;

  const {
    items,
    loading,
    currentPage,
    goToPage,
    amtPerPage,
    updateAmtPerPage,
    totalPages,
  } = usePaginate(service, itemPerPageOptions[0], totalItems);

  const [pageArr, setPageArr] = useState(
    Array.from({ length: Math.min(maxPageButtons, totalPages) }, (_, i) => i)
  );

  const pageInput = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    goToPage(pageInput.current.value - 1);
  }

  useEffect(() => {
    const mid = Math.floor(maxPageButtons / 2);
    if (pageArr[mid] === currentPage) return;

    const newPageArr = Array.from({ length: maxPageButtons }, (_, i) => {
      if (totalPages - currentPage < mid) return i + totalPages - maxPageButtons;
      else if (currentPage < mid) return i;
      return i + currentPage - mid;
    });

    setPageArr(newPageArr);
  }, [currentPage]);

  return (
    <div className={style.container}>
      <h2>Traditional Pages</h2>
      <form className={style.form}>
        <label htmlFor="amtPerPage">Amount Per Page:</label>
        <select
          id="amtPerPage"
          value={amtPerPage}
          onChange={e => updateAmtPerPage(e.target.value)}
        >
          {itemPerPageOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </form>
      {loading ?
        <h1 className={style.loading}>Loading...</h1>
        :
        <ul className={style.itemList}>
          {items?.map((item, i) => <ItemComponent key={i} {...item} />)}
        </ul>
      }
      <ul className={style.pageNumberList}>
        <li>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
          >Prev</button>
        </li>
        {pageArr.map(page =>
          <li key={page}>
            <button
              className={currentPage === page ? style.active : ""}
              onClick={() => goToPage(page)}
            >{page + 1}</button>
          </li>
        )}
        <li>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >Next</button>
        </li>
      </ul>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pageInput">Go To Page: </label>
        <input
          ref={pageInput}
          type="number"
          min={1}
          max={totalPages}
          id="pageInput"
        />
        <button>go</button>
      </form>
    </div>
  )
}