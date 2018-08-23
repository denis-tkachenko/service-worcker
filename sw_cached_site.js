const cacheName = 'v2'

// call install event 
self.addEventListener('install', e => {
  console.log('Service Worker: Installed')
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
    fetch(e.request)
      .then(res => {
        // make copy/clone of server response
        const resClone = res.clone()
        //open cache
        caches
          .open(cacheName)
          .then(cache => {
            // add the server response to cache to use later if offline
            cache.put(e.request, resClone)
          })

        return res
      })// if connection drops we go to catch and use the caches response to the request
      .catch(err => caches.match(e.request).then(res => res))
  )
})

