angular.module('people.directive', [])

.directive('peopleDetailNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/people/people-detail-nav.html'
  }
})

.directive('peopleListGrid', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/people/people-list-grid.html'
  }
})

;