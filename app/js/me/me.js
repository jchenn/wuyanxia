angular.module('me', ['me.ctrl'])

.config(function($stateProvider) {

  // 个人信息相关页面，包括个人资料设置和标签问卷
  $stateProvider

    // 个人资料
    .state('menu.me', {
      url: '/me',
      views: {
        'menu-content': {
          templateUrl: 'templates/me/me.html'
        }
      }
    })

    // 填写个人标签（问卷）
    .state('me-q', {
      url: '/me/q/:id',
      templateUrl: 'templates/me/q.html',
      controller: 'QuestionCtrl'
    })
  ;
})

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
])
;