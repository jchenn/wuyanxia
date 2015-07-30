angular.module('auth.ctrl', ['ionic'])
    .controller('LoginCtrl', function($scope, $http, LoginService, Validate, InfoPopupService, PersonalInfo, PersonalInfoMange) {
        // 模拟
        // $scope.formData = {
        //     'email': "hztest@corp.netease.com",
        //     'password': "123456"
        // };
        $scope.formData = {};
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
                        // InfoPopupService({subTitle:"123"});
                        InfoPopupService(resp.info);
                    } else if (resp.result == 1) {
                        PersonalInfoMange.clear();
                        PersonalInfoMange.update(resp.data);
                        console.log(PersonalInfo);
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
    .controller('RegisterCtrl', function($scope, $ionicBackdrop, $ionicPopup, $timeout, RegisterService, CheckService, PersonalInfoMange, InfoPopupService, Validate) {
        // $scope.formData = {
        //     'email': "123@123.com",
        //     'nickname': "黑月",
        //     'password': "123123"
        // };
        $scope.formData = {};
        $scope.errorData = {};
        $scope.emailSucInfo = {
            title: "验证成功",
            subTitle: "恭喜您验证成功，请填写个人信息让未来室友更加了解您吧"
        };
        $scope.emailFailInfo = {
            title: "验证失败",
            subTitle: "对不起，验证失败了，请检测企业邮箱或重新邮箱验证"
        };
        var emailStatus = {
            email: "",
            isReg: false
        };

console.log($scope.formData);
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
                    // 已验证检测
                    CheckService.get({userId: PersonalInfoMange.get('userId')}, function(resp){
                        if (resp.result == 1) {
                            // 验证成功并跳转
                            InfoPopupService($scope.emailSucInfo, function() {
                                $scope.go('/me-register');
                            });
                        } else if (resp.result == 0) {
                            // InfoPopupService(resp.info);
                            // 验证失败则重置isReg，允许用户重新发送邮箱验证
                            InfoPopupService($scope.emailFailInfo);
                            emailStatus.isReg = false;
                        }
                    }, function(err) {
                        InfoPopupService('网络错误，请重试');
                        console.log(err);
                    })
                    // $scope.successPopup();
                }
            })
        }

        $scope.register = function() {
            $scope.errorEmail = false;
            $scope.errorPwd = false;
            $scope.errorNickName = false;
            //已注册，并且没有修改邮箱
            if (emailStatus.isReg && emailStatus.email === $scope.formData.email ) {
                $scope.showPopup();
                return;
            }

            /**
             * 验证表单
             */
            $scope.errorData = Validate($scope.formData, true);
            // 模拟
            // $scope.errorData = {};
            //验证结果
            if ($scope.errorData.text) {
                if ($scope.errorData.name == "email") {
                    $scope.errorEmail = true;
                } else if ($scope.errorData.name == "nickname") {
                    $scope.errorNickName = true;
                } else if ($scope.errorData.name == "password") {
                    $scope.errorPwd = true;
                };
                console.log($scope.errorData);
            } else {
                console.log("注册");
                // var res = cordova.InAppBrowser.open('http://corp.netease.com/coremail/', '_blank', 'location=yes');
                RegisterService.save({}, $scope.formData, function(resp){
                    console.log(resp);
                    if (resp.result == 1) {
                        console.log('注册请求发送成功');
                        // 缓存注册状态
                        emailStatus.isReg = true;
                        emailStatus.email = $scope.formData.email;
                        
                        PersonalInfoMange.update({name: $scope.formData.nickname})
                        cordova.InAppBrowser.open('http://corp.netease.com/coremail/', '_blank', 'location=no');
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