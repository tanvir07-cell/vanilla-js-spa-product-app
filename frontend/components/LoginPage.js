import router from "../services/router.js";
import ServerApi from "../services/ServerApi.js";

export class LoginPage extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.setAttribute("type", "text/css");

    this.root.appendChild(style);

    async function loadCSS() {
      const css = await fetch("components/LoginPage.css");
      style.textContent = await css.text();
    }
    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("login-page-template");
    this.root.appendChild(template.content.cloneNode(true));

    this.render();
  }

  render() {
    const form = this.root.querySelector("form");
    const registerText = this.root.querySelector("p a");

    form.addEventListener("submit", async (e) => {
      console.log(e);

      e.preventDefault();

      const formData = new FormData(e.target);

      const user = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const res = await ServerApi.login(user);
      console.log(res);
    });

    registerText.addEventListener("click", (e) => {
      e.preventDefault();
      router.navigate("/register");
    });
  }
}

customElements.define("login-page", LoginPage);
