import { loadProducts } from "../utils/loadProducts.js";
import API from "./api.js";

export async function openDB() {
  return await idb.openDB("vanilla-shop", 1, {
    async upgrade(db) {
      await db.createObjectStore("order");
    },
  });
}

export async function saveDB() {
  const db = await app.openDB();
  await db.put("order", JSON.stringify(app.state.cart), "cart");
}

export async function loadDB() {
  const db = await app.openDB();

  //get from the indexdb
  const cart = await db.get("order", "cart");

  if (cart) {
    try {
      app.state.cart = JSON.parse(cart) || [];
    } catch (error) {
      console.error("Error parsing cart", error);
    }
  }
}

export async function saveProductDB() {
  return await idb.openDB("vanilla-product", 1, {
    async upgrade(db) {
      await db.createObjectStore("products", { keyPath: "title" });
    },
  });
}

export async function loadProductDB() {
  // Network First
  const db = await saveProductDB();
  try {
    // We try to fetch from the network
    const data = await API.fetchProducts();
    app.state.products = data;
    console.log("Data from the network");
    // If succeded, also update the cached version
    db.clear("products");
    app.state.products.forEach((product) => db.add("products", product));
  } catch (e) {
    // Network error, we go to the cache
    if ((await db.count("products")) > 0) {
      app.state.products = await db.getAll("products");
      console.log("Data from the cache");
    } else {
      // No cached data is available :(
      console.log("No data is available");
    }
  }

  // Cache images
  if (app.state.products.length > 0) {
    const imageCache = await caches.open("vanilla-product-images");
    app.state.products.forEach((c) => imageCache.add(new Request(c.thumbnail)));
  }
}
