// offline support :

self.addEventListener("install", async (event) => {
  const assets = [
    "/",
    "./app.js",
    "style.css",
    "/services/api.js",
    "/services/idb.js",
    "/services/router.js",
    "/services/state.js",
    "/components/ProductsPage.js",
    "/components/ProductsPage.css",
    "/components/DetailsPage.js",
    "/components/DetailsPage.css",
    "/components/OrderPage.js",
    "/components/OrderPage.css",

    "/utils/addToCart.js",
    "/utils/getProductById.js",
    "/utils/loadProducts.js",
    "/utils/removeProductById.js",
    "https://cdn.jsdelivr.net/npm/idb@7/build/umd.js",
    "https://fonts.googleapis.com/css?family=Rancho&effect=shadow-multiple|3d-float|fire-animation|neon|outline|emboss|shadow-multiple|shadow-sweep|shadow-w-multiple|shadow-w-super|shadow-amour|shadow-into-light|shadow-into-light-two|shadow-dancer",
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
    "https://fonts.gstatic.com/s/rancho/v21/46kulbzmXjLaqZRVam_hVUdI1w.woff2",
  ];
  const cache = await caches.open("cm-assets");
  cache.addAll(assets);
});

// for acceccisg the caching images
self.addEventListener("fetch", async (event) => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        console.log("Returning cached response for:", event.request.url);
        return cachedResponse;
      }
      try {
        const networkResponse = await fetch(event.request);
        console.log("Network request for:", event.request.url);
        return networkResponse;
      } catch (error) {
        console.error("Fetch failed for:", event.request.url, error);
        throw error;
      }
    })()
  );
});
