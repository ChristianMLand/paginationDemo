import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const TOTAL = 1292; // total number of results, would be better to get this total from the DB instead of hardcoding it like this
const MAX_PAGE_BUTTONS = 7; // number of page buttons to show for pagination
const AMOUNT_OPTIONS = [12,24,36,48]; // options for how many pokemon to render per page

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [amtPerPage, setAmtPerPage] = useState(AMOUNT_OPTIONS[0]);
  const [pageArr, setPageArr] = useState(
    Array.from({length: Math.min(MAX_PAGE_BUTTONS, Math.ceil(TOTAL / amtPerPage))}, (_,i) => i)
    );
  const pageInput = useRef(null);
  const loading = useRef(false);

  const fetchPokemon = async controller => {
    loading.current = true;
    const { data } = await axios.get(API_URL, {
      signal: controller.signal,
      params: {limit: amtPerPage, offset: amtPerPage*currentPage}
    });
    const results = await Promise.all(data.results.map(poke => axios.get(poke.url, { signal: controller.signal }))); 
    loading.current = false;
    return results.map(poke => poke.data);
  }

  const handleGoToPage = e => {
    e.preventDefault();
    setCurrentPage(Math.max(0, pageInput.current.value - 1));
  }

  useEffect(() => {
    const mid = Math.floor(MAX_PAGE_BUTTONS / 2);
    const totalPages = Math.ceil(TOTAL / amtPerPage);
    // used to abort requests if useEffect re-runs before the request finishes
    const controller = new AbortController(); 
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    } else {
      fetchPokemon(controller).then(setPokemon);
      if (pageArr[mid] !== currentPage) { 
        setPageArr(Array.from({length: MAX_PAGE_BUTTONS}, (_,i) => {
          if (totalPages - currentPage < mid) return i + totalPages - MAX_PAGE_BUTTONS;
          else if (currentPage < mid) return i; 
          else return i + currentPage - mid;
        }));
      }
    }
    // clean up function to handle aborting the request
    return () => controller.abort(); 
  }, [currentPage, amtPerPage]);

  return (
    <main>
      <form>
        <label htmlFor="amtPerPage">Amount Per Page:</label>
        <select id="amtPerPage" value={amtPerPage} onChange={e => setAmtPerPage(e.target.value)}>
          { AMOUNT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </form>
      <ul id="poke-card-list">
        { loading.current ? <h1>Loading...</h1> : pokemon.map(({ name, sprites, types}) => 
          <li className="poke-card" key={name}>
            <p>{name}</p>
            <img src={sprites?.front_default} alt={name} />
            <div className="types">
              { types.map(({ type }) => <span key={type.name} className={`${type.name} type`}>{type.name}</span>)}
            </div>
          </li>
        )}
      </ul>
      <ul id="page-number-list">
        <li>
          <button onClick={() => setCurrentPage(page => page-1)} disabled={currentPage === 0}>Prev</button>
        </li>
        { pageArr.map(idx =>
          <li key={idx}>
            <button className={currentPage === idx ? "active" : ""} onClick={() => setCurrentPage(idx)}>{idx+1}</button>
          </li>
        )}
        <li>
          <button onClick={() => setCurrentPage(page => page+1)} disabled={currentPage === Math.floor(TOTAL / amtPerPage)}>Next</button>
        </li>
      </ul>
      <form onSubmit={handleGoToPage}>
        <label htmlFor="pageInput">Go To Page: </label>
        <input ref={pageInput} type="number" min={1} max={Math.ceil(TOTAL / amtPerPage)} id="pageInput"/>
        <button>go</button>
      </form>
    </main>
  )
}

export default App