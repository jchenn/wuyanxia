angular.module('wuyanxia', ['ionic', 'house'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      templateUrl: 'templates/tabs.html'
    })

    // 与租房相关的视图
    .state('tab.house', {
      url: '/house',
      views: {
        'house': {
          templateUrl: 'templates/house/house-list.html'
        }
      }
    })

    // 与室友相关的视图
    .state('tab.people', {
      url: '/people',
      views: {
        'people': {
          templateUrl: 'templates/people/people-list.html'
        }
      }
    })

    // 与消息相关的视图
    .state('tab.notice', {
      url: '/notice',
      views: {
        'notice': {
          templateUrl: 'templates/notice/notice-list.html'
        }
      }
    })

    // 与个人信息相关的视图
    .state('tab.me', {
      url: '/me',
      views: {
        'me': {
          templateUrl: 'templates/me/me.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/house');

});
