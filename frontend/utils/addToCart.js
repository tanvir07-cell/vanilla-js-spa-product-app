import getProductById from "./getProductById.js";

export async function addToCart(id) {
  const product = await getProductById(id);
  const results = app.state.cart.filter((prodInCart) => prodInCart.id == id);
  if (results.length == 1) {
    // in line 12 (app.state.cart =) call the proxy setter
    app.state.cart = app.state.cart.map((p) =>
      p.product.id == id ? { ...p, quantity: p.quantity + 1 } : p
    );
  } else {
    app.state.cart = [...app.state.cart, { product, quantity: 1 }];
  }
}
