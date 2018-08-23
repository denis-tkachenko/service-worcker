const cacheName = 'v1'

const cacheAssets = [ // assets to cache in the browser
  'index.html',
  'about.html',
  '/css/style.css',
  '/js/main.js',
]

// call install event 
self.addEventListener('install', e => {
  console.log('Service Worker: Installed')

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files')

        cache.addAll(cacheAssets)
      })
      .then(() => self.skipWaiting())
  )
})

// call activate event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated')

  // remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName) {
            console.log('Service Worker: Clearing Old Caches')
            
            return caches.delete(cache)
          }
        })
      )
    })
  )

})

// call fetch event
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching')

  //check if the life site is available if not get from cache
  e.respondWith(
    // if fetch fail, match the request 'the file of the url request' from caches
    fetch(e.request).catch(() => caches.match(e.request))
  )
})

