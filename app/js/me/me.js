angular.module('me', ['me.ctrl', 'me.service', 'quiz'])

.config(function($stateProvider) {

    // 个人信息相关页面，包括个人资料设置和标签问卷
    $stateProvider

    // 个人资料
    .state('menu.me', {
        url: '/me',
        cache:false,
        views: {
        'menu-content': {
          templateUrl: 'templates/me/me.html',
          controller: 'InfoShow'
        }
        }
    })
    //个人注册信息页面
    .state('menu.meRegister', {
        url: '/me-register',
        cache:false,
        views: {
            'menu-content': {
                templateUrl: 'templates/me/register.html',
                controller: 'InfoRegister'
            }
        }
    })

    //修改个人信息
    .state('menu.meEditor', {
        url: '/me-editor',
        cache:false,
        views: {
            'menu-content': {
                templateUrl: 'templates/me/me-editor.html',
                controller: 'EditorInfo'
            }
        }
    })
    //手机验证
    .state('menu.phoneValidate', {
        url: '/phone-validate',
        cache:false,
        views: {
            'menu-content': {
                templateUrl: 'templates/me/phone-validate.html'
            }
        }
    })
    //身份认证
    .state('menu.idValidate', {
        url: '/id-validate',
        cache:false,
        views: {
            'menu-content': {
                templateUrl: 'templates/me/id-validate.html'
            }
        }
    })

    //邮箱认证
    .state('menu.emailValidate', {
        url: '/email-validate',
        cache:false,
        views: {
            'menu-content': {
                templateUrl: 'templates/me/email-validate.html'
            }
        }
    })
  ;
})

;