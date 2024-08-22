const router = {
  init: function () {
    const routes = document.querySelectorAll("a.navlink");
    routes.forEach((route) => {
      route.addEventListener("click", (e) => {
        e.preventDefault();
        const path = e.target.getAttribute("href");
        this.navigate(path);
      });
    });

    globalThis.addEventListener("popstate", (e) => {
      this.navigate(e.state.path, false);
    });

    // current location

    this.navigate(location.pathname);
  },

  navigate: function (path, addToHistory = true) {
    const main = document.querySelector("main");
    console.log("going to", path);
    if (addToHistory) {
      history.pushState({ path }, null, path);
    }

    if (path === "/") {
      const productsPage = document.createElement("products-page");
      main.innerHTML = "";
      main.appendChild(productsPage);
    }

    if (path === "/order") {
      main.innerHTML = `<h2>Order</h2>`;
    }
  },
};

export default router;
