// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app.controllers', []);
angular.module('app.services', []);
angular.module('app.directives', []);
angular.module('app.filters', []);
angular.module('app', ['ionic', 'ngResource', 'ngCordova', 'app.controllers', 'app.services', 'app.directives', 'app.filters']);

angular.module('app').run(function($ionicPlatform, $rootScope) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      $rootScope.title = 'PanDoo';

      if (window.cordova)
      {
          const singapore = new plugin.google.maps.LatLng(1.361187300000000000,103.82);
          var div = document.getElementById("map_canvas");
          var map = plugin.google.maps.Map.getMap(div);


          map.on(plugin.google.maps.event.MAP_READY, function(){
              $rootScope.map = map;
              const singapore = new plugin.google.maps.LatLng(1.361187300000000000,103.82);
              $rootScope.map.setTrafficEnabled(true);
              $rootScope.map.setOptions({
                  "controls": {
                      "compass": true,
                      "myLocationButton": false,
                      "indoorPicker": false,
                      "zoom": false
                  },
                  'camera': {
                      'latLng': singapore,
                      'tilt': 0,
                      'zoom': 12,
                      'bearing': 0
                  }
              });

              $rootScope.$broadcast('mapCreated', { 'created' : true });
          });
      }
  });
});

angular.module('app').constant('$ionicLoadingConfig', {
    template: '<ion-spinner></ion-spinner>',
    delay: 0,
    noBackdrop: true,
    duration: 10000
});

angular.module('app').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html"
  })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});


