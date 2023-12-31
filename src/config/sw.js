import { cacheNames, clientsClaim } from 'workbox-core';
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import { NetworkFirst, NetworkOnly, Strategy } from 'workbox-strategies';
import { Queue, BackgroundSyncPlugin } from 'workbox-background-sync';

self.skipWaiting();
const cacheName = cacheNames.runtime;
const data = {
  race: false,
  debug: false,
  credentials: 'same-origin',
  networkTimeoutSeconds: 0,
  fallback: 'index.html'
};
const queue = new Queue('recipes')
const broadcast = new BroadcastChannel('todo-recipe-channel');
const bgSyncPlugin = new BackgroundSyncPlugin('ThorQueue', {
  maxRetentionTime: 24 * 60,
});
const manifest = self.__WB_MANIFEST;
const cacheEntries = [];
const manifestURLs = manifest.map(
  (entry) => {
    const url = new URL(entry.url, self.location);
    cacheEntries.push(new Request(url.href, {
      credentials: data.credentials
    }));
    return url.href;
  }
);


const buildStrategy = () => {
  if (data.race) {
    class CacheNetworkRace extends Strategy {
      async _handle(request, handler) {
        const fetchAndCachePutDone = handler.fetchAndCachePut(request);
        const cacheMatchDone = handler.cacheMatch(request);

        return new Promise((resolve, reject) => {
          fetchAndCachePutDone.then(resolve).catch((e) => {
            if (data.debug)
              console.log(`Cannot fetch resource: ${request.url}`, e);
          });
          cacheMatchDone.then(response => response && resolve(response));

          Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
            const [fetchAndCachePutResult, cacheMatchResult] = results;
            if (fetchAndCachePutResult.status === 'rejected' && !cacheMatchResult.value)
              reject(fetchAndCachePutResult.reason);
          });
        });
      }
    }
    return new CacheNetworkRace();
  }
  else {
    if (data.networkTimeoutSeconds > 0)
      return new NetworkFirst({ cacheName, networkTimeoutSeconds: data.networkTimeoutSeconds });
    else
      return new NetworkFirst({ cacheName });
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          if (data.debug)
            console.log(`Checking cache entry to be removed: ${request.url}`);
          if (!manifestURLs.includes(request.url)) {
            cache.delete(request).then((deleted) => {
              if (data.debug) {
                if (deleted)
                  console.log(`Precached data removed: ${request.url || request}`);
                else
                  console.log(`No precache found: ${request.url || request}`);
              }
            });
          }
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
    if(event.request.method !== 'POST'){
      return;
    }

    const bgSyncLogic = async () => {
      try {
        const response = await fetch(event.request.clone());
        return response;
      } catch (error) {
        await queue.pushRequest({request: event.request});
        return error;
      }
    };
  
    event.respondWith(bgSyncLogic());
});

self.addEventListener("push", async (event) => {
  console.log('event:', event.data.text());

  broadcast.postMessage({
    type: 'CRITICAL_SW_UPDATE',
    payload: {
      version: '1.0.1',
      details: 'This is a critical update. Please update your app.'
    }
   });
});

self.addEventListener("sync", async (event) => {
  console.log("sync triggered")
  broadcast.postMessage({
    type: 'CRITICAL_SW_UPDATE',
    payload: {
      version: '1.0.1',
      details: 'This is a critical update. Please update your app.'
    }
   });
});

const statusPlugin = {
  fetchDidSucceed: ({response}) => {
    if(response.status >= 500){
      console.log("serverErorr 1")
      throw new Error('Server Error.');
    }

    console.log('response.status success:', response.status)
    return response;
  },
  fetchDidFail: ({error}) => {
    console.log('response fail:', error)
    throw new Error(error);
  }
};

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  buildStrategy()
);

registerRoute(
  /^https:\/\/6560435083aba11d99d07de5.mockapi.io\/recipes$/,
  new NetworkOnly({
    plugins: [
      bgSyncPlugin,
      statusPlugin
    ],
  }),
  'GET'
);

setDefaultHandler(new NetworkOnly());
setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(data.fallback).then((r) => {
        return r ? Promise.resolve(r) : Promise.resolve(Response.error());
      });
    default:
      return Promise.resolve(Response.error());
  }
});
clientsClaim();