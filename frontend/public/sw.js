const CACHE = "img-cache-v1";

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.destination !== "image") return;

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") cache.put(req, res.clone());
      return res;
    })
  );
});
