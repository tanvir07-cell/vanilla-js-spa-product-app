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
