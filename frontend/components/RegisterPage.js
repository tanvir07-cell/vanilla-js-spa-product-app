import router from "../services/router.js";
import ServerApi from "../services/ServerApi.js";

export class RegisterPage extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.setAttribute("type", "text/css");

    this.root.appendChild(style);

    async function loadCSS() {
      const css = await fetch("components/RegisterPage.css");
      style.textContent = await css.text();
    }
    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("register-page-template");
    this.root.appendChild(template.content.cloneNode(true));

    this.render();
  }

  render() {
    const form = this.root.querySelector("form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      const user = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const res = await ServerApi.register(user);
      console.log(res);
    });
  }
}

customElements.define("register-page", RegisterPage);
