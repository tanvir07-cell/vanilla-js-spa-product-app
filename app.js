// set the state to the global:

import router from "./services/router.js";
import STATE from "./services/state.js";
import { loadMovies } from "./utils/loadMovies.js";

// for web components:

import { ProductsPage } from "./components/ProductsPage.js";

globalThis.app = {
  state: STATE,
  router,
};

globalThis.addEventListener("DOMContentLoaded", () => {
  // load the routes:
  app.router.init();
  loadMovies();
});
