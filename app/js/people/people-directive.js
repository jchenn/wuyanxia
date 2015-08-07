angular.module('people.directive', [])

.directive('peopleDetailNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/people/people-detail-nav.html'
  }
})

.directive('peopleListGrid', function($window) {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var grid = element.find('ul')[0];

      addPadding();
      $window.addEventListener('resize', addPadding);

      function addPadding() {
        console.log(grid.offsetWidth);
      }
    },
    templateUrl: 'templates/people/people-list-grid.html'
  }
})

;