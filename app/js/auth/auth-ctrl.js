angular.module('auth.ctrl', ['ionic'])
    .controller('LoginCtrl', function($scope, $http, LoginService, Validate, InfoPopupService) {
        // 模拟
        $scope.formData = {
            'email': "123@123.com",
            'password': "123123"
        };
        // $scope.formData = {};
        $scope.errorData = {};
        console.log($scope.myForm);
        $scope.changePwd = function() {
            InfoPopupService('老子还没被整出来');
        };
        $scope.login = function() {
            $scope.errorEmail = false;
            $scope.errorPwd = false;
            // 验证表单
            $scope.errorData = Validate($scope.formData, false);
            if ($scope.errorData.text) {
                //如果有错误信息；
                if ($scope.errorData.name == "email") {
                    $scope.errorEmail = true;
                } else if ($scope.errorData.name == "password") {
                    $scope.errorPwd = true;
                };
                console.log($scope.errorData);
            } else {
                // 没有错误信息就登录
                console.log("登录");
                console.log($scope.formData);
                console.log(JSON.stringify($scope.formData));
                var stringData = JSON.stringify($scope.formData);

                LoginService.save({}, $scope.formData, function(resp) {
                    //成功
                    console.log(resp.result);
                    if (resp.result == 0) {
                        InfoPopupService({subTitle:"123"});
                        // InfoPopupService(resp.info);
                    } else if (resp.result == 1) {
                        $scope.go('/menu/people-list');
                    }
                }, function(resp) {
                    //失败
                    console.log(resp);
                    InfoPopupService(resp.info);
                });
            }
        }
    })
    .controller('RegisterCtrl', function($scope, $ionicBackdrop, $ionicPopup, $timeout, RegisterService, CheckService, InfoPopupService, Validate) {
        $scope.formData = {
            'email': "123@123.com",
            'nickname': "黑月",
            'password': "123123"
        };
        $scope.errorData = {};
        $scope.emailSucInfo = {
            title: "验证成功",
            subTitle: "恭喜您验证成功，请填写个人信息让未来室友更加了解您吧"
        };
        $scope.emailFailInfo = {
            title: "验证失败",
            subTitle: "对不起，验证失败了，请检测企业邮箱或重新邮箱验证"
        };
console.log($scope.formData);
        $scope.register = function() {
            $scope.errorEmail = false;
            $scope.errorPwd = false;
            $scope.errorNickName = false;
            /**
             * 弹层
             */
            // 验证弹层
            $scope.showPopup = function() {
                $scope.data = {};
                var myPopup = $ionicPopup.show({
                    title: '已向您的企业邮箱中发出认证邮件，请查收完成邮箱验证',
                    scope: $scope,
                    buttons: [{
                        text: '还未验证'
                    }, {
                        text: '<b>已验证完成</b>',
                        type: 'button-positive',
                        onTap: function() {
                            return true;
                        }
                    }]
                });
                myPopup.then(function(resp) {
                    if (resp === true) {
                        CheckService.get({userId:'213'}, function(resp){
                            InfoPopupService($scope.emailSucInfo, function() {
                                $scope.go('/me/register');
                            });
                        }, function(err) {
                            InfoPopupService($scope.emailFailInfo);
                        })
                        // $scope.successPopup();
                    }
                })
            }
            // 弹层：验证通过
            $scope.successPopup = function() {
                var myPopup = $ionicPopup.show({
                    title: '验证成功',
                    subTitle: '恭喜您验证成功，请填写个人信息让未来室友更加了解您吧'
                });
                $timeout(function() {
                    myPopup.close();
                    // 跳转
                    // $scope.go('/')
                }, 1500);
            }
            // 弹层：验证失败
            $scope.failPopup = function() {
                var myPopup = $ionicPopup.show({
                    title: '验证失败',
                    subTitle: '对不起，验证失败了，请检测企业邮箱或重新邮箱验证'
                });
                $timeout(function() {
                    myPopup.close();
                }, 1500);
            }
            /**
             * 验证表单
             */
            $scope.errorData = Validate($scope.formData, true);
            // 模拟
            $scope.errorData = {};
            //验证结果
            if ($scope.errorData.text) {
                if ($scope.errorData.name == "email") {
                    $scope.errorEmail = true;
                } else if ($scope.errorData.name == "nickName") {
                    $scope.errorNickName = true;
                } else if ($scope.errorData.name == "pwd") {
                    $scope.errorPwd = true;
                };
                console.log($scope.errorData);
            } else {
                console.log("注册");
                // var ref = cordova.InAppBrowser.open('http://corp.netease.com/coremail/', '_blank', 'location=yes');
                RegisterService.save({}, $scope.formData, function(resp){
                    console.log(resp);
                    if (resp.result == 1) {
                        console.log('注册成功');
                        $scope.showPopup();
                    } else if (resp.result == 0) {
                        InfoPopupService(resp.info);
                    };
                }, function(resp){
                    //失败
                    console.log('注册失败');
                    console.log(resp);
                    InfoPopupService(resp.info);
                })
                // $scope.showPopup();
            }
        }
    });