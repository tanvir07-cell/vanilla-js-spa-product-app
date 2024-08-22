import API from "../services/api.js";
import STATE from "../services/state.js";

export const loadMovies = async () => {
  const products = await API.fetchMovies();
  STATE.products = products;
};
