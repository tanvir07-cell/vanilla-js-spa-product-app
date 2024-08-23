import API from "../services/api.js";
import STATE from "../services/state.js";

export const loadProducts = async () => {
  const products = await API.fetchMovies();
  STATE.products = products;
};
