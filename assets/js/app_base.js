window.app = {
  models: {},
  collections: {},
  views: {},
  routers: {},
  init: function() {
    app.routers.main = new app.routers.MainRouter();
    // Enable pushState for compatible browsers
    var enablePushState = true;
    // Disable for older browsers
    var pushState = !!(enablePushState && window.history && window.history.pushState);
    // Start **Backbone History**
    Backbone.history = Backbone.history || new Backbone.History({});
    Backbone.history.start({
      pushState:pushState
    });
  }
};

// Define routes
app.routers.MainRouter = Backbone.Router.extend({

  routes: {
    '': 'home',
    'map/': 'transitAdd',
    'map/view.html': 'transitShow'
    // 'demo': 'demo',
    // 'map/add?*queryString': 'transitAdd',
    // 'map/edit/:token': 'transitEdit',
    // 'map/:slug/:title': 'transitShow',
  },

  initialize: function(){
    app.views.util = new app.views.Util({});
  },

   demo : __data(),
  home: __data(),

});
