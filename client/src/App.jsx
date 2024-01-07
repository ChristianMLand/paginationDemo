import { Paginator, InfiniScroll, PokeCard } from "~/components";
import { getPokemonCount, getPokemon } from "~/services";
import { useDataFetcher } from '~/hooks';

export default function App() {
  const {data:count, loading} = useDataFetcher(getPokemonCount);

  if (loading || !count) return <h1>Loading...</h1>;

  return (
    <>
      <h1>All Pokemon ({count})</h1>
      <main>
        <Paginator
          service={getPokemon}
          limitOptions={[12, 24, 36, 48]}
          maxPageButtons={7}
          totalItems={151}
          ItemComponent={PokeCard}
        />
        <InfiniScroll
          service={getPokemon}
          limit={24}
          bufferDistance={250}
          totalItems={count}
          ItemComponent={PokeCard}
        />
      </main>
    </>
  )
}