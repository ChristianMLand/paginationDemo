import axios from 'axios';

export const getPokemon = async (config={ params: { limit: 10000 } }) => {
    let data, error;
    try {
        const { data:res } = await axios.get("https://pokeapi.co/api/v2/pokemon", config);
        const results = await Promise.all(res.results.map(poke => axios.get(poke.url, config)));
        data = results.map(poke => poke.data);
    } catch (err) {
        error = err;
    } finally {
        return { data, error };
    }
}
