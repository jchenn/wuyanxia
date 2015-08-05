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

;