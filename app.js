// set the state to the global:

import router from "./services/router.js";
import STATE from "./services/state.js";

navigator.serviceWorker.register("/sw.js");

// for web components:

import { ProductsPage } from "./components/ProductsPage.js";
import { DetailsPage } from "./components/DetailsPage.js";
import { OrderPage } from "./components/OrderPage.js";
import { loadDB, loadProductDB, openDB } from "./services/idb.js";

globalThis.app = {
  state: STATE,
  router,
  openDB,
};

globalThis.addEventListener("DOMContentLoaded", () => {
  // load products from network and indexdb and store it to the app.state.products array
  loadProductDB();

  // load cart from the indexdb:

  loadDB();

  // Update the cart badge on initial load
  updateCartBadge();

  // load the routes:
  app.router.init();
});

let deferredPrompt;

globalThis.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to show the download button
  const downloadButton = document.getElementById("downloadButton");
  if (downloadButton) {
    downloadButton.style.display = "block";
  }
});

document.getElementById("downloadButton").addEventListener("click", (e) => {
  // Hide the download button
  e.preventDefault();
  const downloadButton = document.getElementById("downloadButton");
  if (downloadButton) {
    downloadButton.style.display = "none";
  }

  // Show the install prompt
  if (deferredPrompt) {
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
    });
  }
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

// storage persistence:
// we want to persist the data
// alltime because we know when we are not connected to our
// website for so long then the browser will remove the data on the storage
// so we want to persist the data all the time:

(async function () {
  if (navigator.storage && navigator.storage.persist) {
    if (!(await navigator.storage.persisted())) {
      const result = await navigator.storage.persist();
      console.log(`Was Persistent Storage Request granted? ${result}`);
    } else {
      console.log(`Persistent Storage already granted`);
    }
  }
})();

(async function () {
  if (navigator.storage && navigator.storage.estimate) {
    const q = await navigator.storage.estimate();
    console.log(`quota available: ${parseInt(q.quota / 1024 / 1024)}MiB`);
    console.log(`quota usage: ${q.usage / 1024}KiB`);
  }
})();
