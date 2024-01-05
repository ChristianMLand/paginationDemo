import { Paginator, InfiniScroll } from "~/components";
import { getPokemon } from "~/services";

export default function App() {
    return (
      <>
        <h1>All Pokemon</h1>
        <main>
              <Paginator
                  service={getPokemon}
                  itemPerPageOptions={[12,24,36,48]}
                  maxPageButtons={7}
                  totalItems={1302}
              />
              <InfiniScroll
                  service={getPokemon}
                  batchSize={25}
                  totalItems={1302}
              />
        </main>
      </>
    )
}