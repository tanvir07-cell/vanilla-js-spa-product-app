const API = {
  url: "https://fakestoreapi.com/products",
  fetchMovies: async function () {
    const response = await fetch(this.url);
    const data = await response.json();
    return data;
  },
};

export default API;
