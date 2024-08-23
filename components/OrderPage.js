export class OrderPage extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    // css:
    const style = document.createElement("style");
    this.root.appendChild(style);

    async function loadCSS() {
      const css = await fetch("components/OrderPage.css");
      style.textContent = await css.text();
    }

    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("order-page-template");
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.render();

    globalThis.addEventListener("app:cart-updated", () => {
      this.render();
    });
  }

  render() {
    const cart = app.state.cart;
    const orderList = this.root.querySelector("#order-list");

    orderList.innerHTML = ""; // Clear the list

    if (cart.length === 0) {
      orderList.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
    } else {
      // Use a Map to keep track of the quantity for each product
      const productMap = new Map();

      cart.forEach((item) => {
        if (productMap.has(item.product.id)) {
          // If the product is already in the map, update the quantity
          const existingItem = productMap.get(item.product.id);
          existingItem.quantity += item.quantity;
        } else {
          // If the product is not in the map, add it
          productMap.set(item.product.id, { ...item });
        }
      });

      // Now iterate over the productMap to display each product once
      productMap.forEach((item) => {
        const orderItem = document.createElement("li");
        orderItem.classList.add("glass");
        orderItem.classList.add("dark-blue-mesh");
        orderItem.innerHTML = `
            <img src=${item.product.image} />
            <h2>${item.product.title}</h2>
            <p>$ ${item.product.price}</p>
            <p>Qty: ${item.quantity}x</p>
          `;

        orderList.appendChild(orderItem); // Append each unique item to the list
      });
    }

    const total = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const totalDiv = this.root.querySelector("#total");
    totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  }
}

customElements.define("order-page", OrderPage);
