import { Paginator, InfiniScroll, PokeCard } from "~/components";
import { getPokemonCount, getPokemon } from "~/services";
import { useDataFetcher } from '~/hooks';

export default function App() {
    const [totalPokemon, loading] = useDataFetcher(getPokemonCount);

    if (loading || !totalPokemon) return <h1>Loading...</h1>;
  
    return (
      <>
        <h1>All Pokemon ({totalPokemon})</h1>
        <main>
              <Paginator
                  service={getPokemon}
                  itemPerPageOptions={[12,24,36,48]}
                  maxPageButtons={7}
                  totalItems={totalPokemon}
                  ItemComponent={PokeCard}
              />
              <InfiniScroll
                  service={getPokemon}
                  batchSize={25}
                  bufferDistance={150}
                  totalItems={totalPokemon}
                  ItemComponent={PokeCard}
              />
        </main>
      </>
    )
}