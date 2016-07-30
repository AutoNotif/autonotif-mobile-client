// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pushApp = angular.module('pushApp', ['ionic']);
var reg_id;
var logged_in = false;

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


      window.push = PushNotification.init({
        android: {
          senderID: "1000189835312",
        },
      });

      window.push.on('registration', function(data) {
        reg_id = data.registrationId;
        // data.registrationId
      });

      window.push.on('notification', function(data) {

        if(localStorage.getItem('messages')) {
          var messages = JSON.parse(localStorage.getItem('messages'));
          if(messages.indexOf({content:data.message, title:data.title, id:data.additionalData.id_token}) !== -1) {
            return;
          }

          messages.push({content:data.message, title:data.title, id:data.additionalData.id_token});
          localStorage.setItem('messages', JSON.stringify(messages));
        } else {
          localStorage.setItem('messages', JSON.stringify([{content:data.message, title:data.title, id:data.id}]));
        }
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
      });

      window.push.on('error', function(e) {
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
    pushes: JSON.parse(localStorage.getItem('messages'))
  };

  return {
    getPushes: function () {
      return data.pushes;
    },
    add: function (pushData) {
      data.pushes.push(pushData);
    },
    count: function() {
      if(data.pushes) {
        return data.pushes.length;
      }
      else return 0;
    },
    getPush: function(id) {
      for (var i = 0; i < data.pushes.length; i++) {
        if(data.pushes[i].id === id) {
          return data.pushes[i];
        }
      }
      return null;
    },
    refreshPushes: function() {
      data.pushes = JSON.parse(localStorage.getItem('messages'));
    }
  };
});

pushApp.controller('MainCtrl', function($scope, $state) {
  "use strict";

})

pushApp.controller('LoginCtrl', function($scope, $state, $http, $ionicPopup, $location) {
  "use strict";

  if(localStorage.getItem('logged_in')) {
    $location.path('home')
  }

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
              localStorage.setItem("logged_in", true);
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

pushApp.controller('PushCtrl', function($scope, $state, $stateParams, $ionicPopup, PushData, $ionicHistory, $location) {
  "use strict";

  var push = PushData.getPush($stateParams.id)

  if(!push) {
    $location.path('home');
    return;
  }
  $scope.name = push.title;
  $scope.content = push.content;
  // $scope.time = push.time;

  $scope.delete = () => {
    console.log();

      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete push',
        template: 'Are you sure you want to delete this push?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          var messages = JSON.parse(localStorage.getItem('messages'));
          PushData.refreshPushes();
          messages.splice(PushData.getPushes().indexOf(push), 1);
          localStorage.setItem('messages', JSON.stringify(messages));
          $location.path('home');
        }
      });

  }

  $scope.back = () => {
    $ionicHistory.goBack();
  }
})

pushApp.controller('HomeCtrl', function($scope, $state, PushData) {
  "use strict";

  if(PushData.count() > 0) {
    $scope.list = PushData.getPushes().reverse()
  }


  $scope.doRefresh = () => {

    PushData.refreshPushes();

    if(PushData.count() > 0) {
      $scope.list = PushData.getPushes().reverse();
    }
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
