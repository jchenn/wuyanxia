angular.module('people.directive', [])

.directive('peopleDetailNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/people/people-detail-nav.html'
  }
})

.directive('peopleListGrid', function($window, $ionicScrollDelegate) {
  return {
    restrict: 'E',
    replace: true,
    link: function(scope, element) {
      var grid = element[0].childNodes[0];

      addPadding();
      $window.addEventListener('resize', addPadding);

      scope.$on('$destroy', function() {
        // console.log('[destroy] peopleListGrid');
        $window.removeEventListener('resize', addPadding);
      });

      function addPadding() {
        var w = grid.offsetWidth, m, p = 0;
        for (m = 16; m >= 1; --m) {
          if (m * 172 <= w) {
            // console.log(m);
            p = (w - 172 * m - 16) / (2 + 2 * m);
            break;
          }
        }
        // console.log('padding', p);
        grid.style.padding = '0 ' + (p + 8) + 'px'
        $ionicScrollDelegate.resize();
      }
    },
    controller: function($scope, $element) {
      // var grid = element.find('ul')[0];
      $scope.$on('remove', function() {
        console.log('remove', $element);
        // angular.element($element).remove();
      });

      $scope.$on('$destroy', function() {
        console.log('[destroy] peopleListGrid');
        this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
      });
    },
    templateUrl: 'templates/people/people-list-grid.html'
  }
})

;