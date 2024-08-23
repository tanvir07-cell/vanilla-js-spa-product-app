// set the state to the global:

import router from "./services/router.js";
import STATE from "./services/state.js";
import { loadProducts } from "./utils/loadProducts.js";

// for web components:

import { ProductsPage } from "./components/ProductsPage.js";
import { DetailsPage } from "./components/DetailsPage.js";
import { OrderPage } from "./components/OrderPage.js";

globalThis.app = {
  state: STATE,
  router,
};

globalThis.addEventListener("DOMContentLoaded", () => {
  // Load the cart from localStorage
  // and save it to the global app state
  // so that it can be accessed from anywhere
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  app.state.cart = savedCart;

  // Update the cart badge on initial load
  updateCartBadge();

  // load the routes:
  app.router.init();
  loadProducts();
});

function updateCartBadge() {
  const badge = document.querySelector("#badge");
  const qty = app.state.cart.reduce((acc, item) => acc + item.quantity, 0);
  badge.textContent = qty;
  badge.hidden = qty === 0;
}

// Update the badge when the cart is updated
globalThis.addEventListener("app:cart-updated", () => {
  updateCartBadge();
});
