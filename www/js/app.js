// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pushApp = angular.module('pushApp', ['ionic']);
var reg_id;

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

      var push = PushNotification.init({
        android: {
          senderID: "1000189835312"
        },
      });

      push.on('registration', function(data) {
        cordova.plugins.clipboard.copy(data.registrationId);
        reg_id = data.registrationId;
        // data.registrationId
      });

      push.on('notification', function(data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
      });

      push.on('error', function(e) {
        // e.message
      });

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

pushApp.controller('LoginCtrl', function($scope, $state, $http, $ionicPopup, $location) {
  "use strict";

  $scope.username = 'user';
  $scope.password = 'password';
  $scope.server = 'http://192.168.1.72:3000'

  $scope.login = () => {
    if(!$scope.username) return;
    if(!$scope.password) return;
    if(!$scope.server) return;

    var auth = btoa($scope.username + ':' + $scope.password);

    $http({method: 'GET',
            url: $scope.server + '/api/v1/device?reg_id=' + reg_id,
            headers: {'Authorization': 'Basic ' + auth}
          })
          .then(function(data) {
            if(data.data.success) {
              $location.path('home')
            } else {
              $ionicPopup.alert(
                {title: 'could not connect'}
              )
            }
          })
          .catch(function(data) {
            if(data.status === 401) {
              $ionicPopup.alert(
                {title: 'Invalid username or password'}
              )
            } else {
              $ionicPopup.alert(
                {title: 'Could not connect'}
              )
            }

          })
  }
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
    controller: 'LoginCtrl'
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
