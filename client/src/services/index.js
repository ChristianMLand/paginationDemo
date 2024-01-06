import axios from 'axios';

const API_URL = "https://pokeapi.co/api/v2/pokemon";

export const getPokemon = async (limit, offset, controller) => {
  try {
    const { data } = await axios.get(API_URL, {
      signal: controller.signal,
      params: { limit, offset }
    });
    const results = await Promise.all(data.results.map(poke =>
      axios.get(poke.url, { signal: controller.signal })
    ));
    return results.map(poke => poke.data);
  } catch (err) {
    return [];
  }
}

export const getPokemonCount = async controller => {
  try {
    const { data } = await axios.get(API_URL, {
      signal: controller.signal,
      params: { limit: 1 }
    });
    return data.count;
  } catch (err) {
    return 0;
  }
}
