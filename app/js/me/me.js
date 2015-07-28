angular.module('me', ['me.ctrl', 'me.service'])

.config(function($stateProvider) {

  // 个人信息相关页面，包括个人资料设置和标签问卷
  $stateProvider

    // 个人资料
    .state('me', {
      url: '/me',
      templateUrl: 'templates/me/me.html'
    })

    // 填写个人标签（问卷）
    .state('me-q', {
      url: '/me/q/:number',
      params: {number: '1'},
      templateUrl: 'templates/me/q.html',
      controller: 'QuestionCtrl'
    })

    //个人注册信息页面
      .state('me-register', {
          url: '/me-register',
          templateUrl: 'templates/me/register.html'
      })
      //修改个人信息
      .state('me-editor', {
        url: '/me-editor',
        templateUrl: 'templates/me/me-editor.html'
      })
      //手机验证
      .state('phone-validate', {
        url: '/phone-validate',
        templateUrl: 'templates/me/phone-validate.html'
      })
      //身份认证
      .state('id-validate', {
        url: '/id-validate',
        templateUrl: 'templates/me/id-validate.html'
      })
      //邮箱认证
      .state('email-validate', {
        url: '/email-validate',
        templateUrl: 'templates/me/email-validate.html'
      })
  ;
})

.constant('HTTP_PREFIX', 'http://10.242.37.68:4000')

.constant('QuestionList', [
  {id: '1', label: '您的身份', 
    choices: [
      {id: '1', image: 'img/image-m.png', answer: '我有房源，要招合租室友'},
      {id: '2', image: 'img/image-m.png', answer: '我无房源，要招人一块合租'}
    ]
  },
  {id: '2', label: '生活作息上您是一个', 
    choices: [
      {id: '1', image: 'img/image-m.png', answer: '早起鸟'},
      {id: '2', image: 'img/image-m.png', answer: '夜猫子'}
    ]
  },
  {id: '3', label: '对抽烟您的感受', 
    choices: [
      {id: '1', image: 'img/image-m.png', answer: '我也抽烟'},
      {id: '2', image: 'img/image-m.png', answer: '无所谓'},
      {id: '3', image: 'img/image-m.png', answer: '讨厌烟味'}
    ]
  },
  {id: '4', label: '对小动物您的感受', 
    choices: [
      {id: '1', image: 'img/image-m.png', answer: '我养宠物'},
      {id: '2', image: 'img/image-m.png', answer: '都可以'},
      {id: '3', image: 'img/image-m.png', answer: '讨厌动物'}
    ]
  },
  {id: '5', label: '平时生活中您的私人物品', 
    choices: [
      {id: '1', image: 'img/image-m.png', answer: '整整齐齐'},
      {id: '2', image: 'img/image-m.png', answer: '突击清理'},
      {id: '3', image: 'img/image-m.png', answer: '随便放放'}
    ]
  },
  {id: '6', label: '生活中来您家访问的朋友', 
    choices: [
      {id: '1', image: 'img/image-m.png', answer: '高朋满座'},
      {id: '2', image: 'img/image-m.png', answer: '偶尔探望'},
      {id: '3', image: 'img/image-m.png', answer: '基本没有'}
    ]
  },
  {id: '7', label: '您认为您的个性', 
    choices: [
      {id: '1', image: 'img/image-m.png', answer: '开朗大方'},
      {id: '2', image: 'img/image-m.png', answer: '普普通通'},
      {id: '3', image: 'img/image-m.png', answer: '沉着稳重'}
    ]
  }
]);
