export class ProductsPage extends HTMLElement {
  constructor() {
    super();

    // shadow dom:

    this.root = this.attachShadow({ mode: "open" });

    // for style:
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");

    this.root.appendChild(style);

    async function loadCSS() {
      const css = await fetch("components/ProductsPage.css");
      style.textContent = await css.text();
    }
    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("products-page-template");
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    globalThis.addEventListener("app:products-updated", () => {
      this.render();
    });

    // initially load the data:
    this.render();
  }

  render() {
    const products = app.state.products;
    const productsList = this.root.querySelector("#products");

    productsList.innerHTML = "";

    if (products.length === 0) {
      productsList.innerHTML = `<div class = "loader-container"><div class="loader"></div></div>`;
    } else {
      products.forEach((product) => {
        const productItem = document.createElement("li");
        productItem.innerHTML = `
            <img
            src=${product.image}

             
            />
            <h2>${product.title}</h2>
            <p>${product.description.slice(0, 50).concat("...")}</p>
            <p>$ ${product.price}</p>
            <button data-id="${
              product.id
            }" class="dark-blue-mesh glass">Add to cart</button>
            `;
        productsList.appendChild(productItem);
      });
    }
  }
}

customElements.define("products-page", ProductsPage);
