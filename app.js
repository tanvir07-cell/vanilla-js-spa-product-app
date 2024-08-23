// set the state to the global:

import router from "./services/router.js";
import STATE from "./services/state.js";
import { loadProducts } from "./utils/loadProducts.js";

// for web components:

import { ProductsPage } from "./components/ProductsPage.js";
import { DetailsPage } from "./components/DetailsPage.js";

globalThis.app = {
  state: STATE,
  router,
};

globalThis.addEventListener("DOMContentLoaded", () => {
  // load the routes:
  app.router.init();
  loadProducts();
});

globalThis.addEventListener("app:cart-updated", (e) => {
  console.log(e);
  const badge = document.querySelector("#badge");
  const qty = app.state.cart.reduce((acc, item) => acc + item.quantity, 0);
  badge.textContent = qty;
  badge.hidden = qty === 0;
});
