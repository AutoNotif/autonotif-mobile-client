// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pushApp = angular.module('pushApp', ['ionic']);

pushApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

pushApp.factory('PushData', function () {

    var data = {
        pushes: []
    };

    return {
        getPushes: function () {
            if(data.pushes.length === 0) {
              for (var i = 0; i < 50; i++) {
                data.pushes.push({id:i, name:'Title', time:'27/07/2016 - 00:40', content:'Qui officia deserunt mollit anim id est laborum. Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque. Nihil molestiae consequatur, vel illum qui dolorem eum. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'})
              }
            }
            return data.pushes;
        },
        add: function (pushData) {
          console.log(data);
            data.pushes.push(pushData);
        },
        count: function() {
          return data.pushes.length;
        },
        getPush: function(id) {
          if(data.pushes.length === 0) {
            for (var i = 0; i < 50; i++) {
              data.pushes.add({id:i, name:'Title', time:'27/07/2016 - 00:40', content:'Qui officia deserunt mollit anim id est laborum. Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque. Nihil molestiae consequatur, vel illum qui dolorem eum. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'})
            }
          }
          for (var i = 0; i < data.pushes.length; i++) {
            if(data.pushes[i].id === id) {
              return data.pushes[i];
            }
          }
          return null;
        }
    };
});

pushApp.controller('MainCtrl', function($scope, $state) {
  "use strict";

})

pushApp.controller('SettingsCtrl', function($scope, $state, $ionicHistory) {
  "use strict";

  $scope.back = () => {
    $ionicHistory.goBack();
  }
})

pushApp.controller('PushCtrl', function($scope, $state, $stateParams, PushData, $ionicHistory) {
  "use strict";

  var push = PushData.getPush(parseInt($stateParams.id))

  $scope.name = push.name;
  $scope.content = push.content;
  $scope.time = push.time;

  $scope.back = () => {
    $ionicHistory.goBack();
  }
})

pushApp.controller('HomeCtrl', function($scope, $state, PushData) {
  "use strict";

  $scope.list = PushData.getPushes().slice(-25).reverse();
  let lastLength = PushData.getPushes().length;

  //for testing
  window.addMore = () => {
      PushData.add({id:PushData.count(), name:'Title', time:'27/07/2016 - 00:40', content:'IT WERKS'})
  }


  $scope.doRefresh = () => {
    $scope.list = PushData.getPushes().slice(lastLength).reverse().concat($scope.list);
    lastLength = PushData.getPushes().length;
    $scope.$broadcast('scroll.refreshComplete');
  }

})

pushApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: '../templates/login.html',
    controller: 'MainCtrl'
  })
  .state('home', {
    url: '/home',
    templateUrl: '../templates/home.html',
    controller: 'HomeCtrl'
  })
  .state('push', {
    url: '/push/:id',
    templateUrl: '../templates/push.html',
    controller: 'PushCtrl'
  })
  .state('settings', {
    url: '/settings',
    templateUrl: '../templates/settings.html',
    controller: 'SettingsCtrl'
  })
});
