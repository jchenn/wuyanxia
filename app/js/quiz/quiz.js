angular.module('quiz', ['quiz.ctrl', 'quiz.service'])

.config(function($stateProvider) {

  $stateProvider

    // 询问是否有房
    .state('quiz-house', {
      url: '/quiz/house',
      cache: false,
      templateUrl: 'templates/quiz/quiz-house.html',
      controller: 'QuizHouseCtrl'
    })

    // 填写个人标签（问卷）
    .state('quiz', {
      url: '/quiz',
      cache: false,
      templateUrl: 'templates/quiz/quiz.html',
      controller: 'QuizCtrl'
    })

    // 修改个人标签
    .state('quiz-edit', {
      url: '/quiz/:name',
      cache: false,
      templateUrl: 'templates/quiz/quiz-edit.html',
      controller: 'QuizEditCtrl'
    })
  ;
})

.directive('quizProgress', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/quiz/quiz-progress.html',
    controller: function($scope, $element) {
      var meter = $element.find('li');

      $scope.$on('next', next);
      $scope.$on('previous', previous);
      $scope.$on('$destroy', function() {
        console.log('destroy quiz-progress');

        meter = null;
        $scope = null;
      });

      function next(event, current) {
        // console.log(typeof current, current);
        move(current + 1);
      }

      function previous(event, current) {
        move(current - 1);
      }

      // 将当前元素加上 active 类，将之前元素加上 done 类
      function move(current) {
        // console.log('move', current);
        // console.log(meter);

        clear();

        // console.log(meter[current]);
        // console.log(angular.element(meter[current]));

        for (var i = 0; i < current; ++i) {
          angular.element(meter[i]).addClass('done');
        }

        angular.element(meter[current]).addClass('active');
      }

      function clear() {

        for (var i = 0; i < meter.length; ++i) {
          angular.element(meter[i]).removeClass('active done');
        }
      }

    }
  }
})

;