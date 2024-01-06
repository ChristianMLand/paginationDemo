import { Paginator, InfiniScroll, PokeCard } from "~/components";
import { getPokemonCount, getPokemon } from "~/services";
import { useDataFetcher } from '~/hooks';

export default function App() {
  const [count, loading] = useDataFetcher(getPokemonCount);

  if (loading || !count) return <h1>Loading...</h1>;

  return (
    <>
      <h1>All Pokemon ({count})</h1>
      <main>
        <Paginator
          service={getPokemon}
          itemPerPageOptions={[12, 24, 36, 48]}
          maxPageButtons={7}
          totalItems={count}
          ItemComponent={PokeCard}
        />
        <InfiniScroll
          service={getPokemon}
          batchSize={24}
          bufferDistance={250}
          totalItems={count}
          ItemComponent={PokeCard}
        />
      </main>
    </>
  )
}