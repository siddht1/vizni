//service worker
navigator.serviceWorker && navigator.serviceWorker.register('../assets/add_js/sw.js').then(function(registration) {
  console.log('Excellent, registered with scope: ', registration.scope);
});
