const v = '0.0.1';
const cacheArray = [
  './',
  './assets/css/main.min.css',
  './assets/js/game.js',
  './assets/img/player1/dice-01.svg',
  './assets/img/player1/dice-02.svg',
  './assets/img/player1/dice-03.svg',
  './assets/img/player1/dice-04.svg',
  './assets/img/player1/dice-05.svg',
  './assets/img/player1/dice-06.svg',
  './assets/img/player2/dice-01.svg',
  './assets/img/player2/dice-02.svg',
  './assets/img/player2/dice-03.svg',
  './assets/img/player2/dice-04.svg',
  './assets/img/player2/dice-05.svg',
  './assets/img/player2/dice-06.svg',

];
self.addEventListener('install', async event => {
  const cache = await caches.open(`terningspill ${v}`);
  cache.addAll(cacheArray);
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if(url.origin == location.origin){
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedRespons = await caches.match(req);
  return cachedRespons || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open('font');

  try {
    const res = await fetch(req);
    caches.put(req, res.clone());
    return res;
  } catch (e) {
    return await caches.match(req);
  }
}
