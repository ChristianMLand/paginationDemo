import axios from 'axios';

const API_URL = "https://pokeapi.co/api/v2/pokemon";

export const getPokemon = async (signal, limit = -1, offset = 0) => {
  const config = {
    signal,
    params: { limit, offset }
  };
  const { data } = await axios.get(API_URL, config);
  const res = await Promise.all(data.results.map(p => axios.get(p.url, config)));
  return res.map(poke => poke.data);
}

export const getPokemonCount = async signal => {
  const config = {
    signal,
    params: { limit: 1 }
  };
  const { data } = await axios.get(API_URL, config);
  return data.count;
}
