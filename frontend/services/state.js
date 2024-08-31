const STATE = {
  products: [],
  cart: [],
};

const proxiedStore = new Proxy(STATE, {
  set: (target, property, value) => {
    target[property] = value;

    if (property === "products") {
      globalThis.dispatchEvent(new Event("app:products-updated"));
    }

    if (property === "cart") {
      globalThis.dispatchEvent(new Event("app:cart-updated"));
    }

    return true;
  },

  get: (target, property) => {
    return target[property];
  },
});

export default proxiedStore;
