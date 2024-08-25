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
