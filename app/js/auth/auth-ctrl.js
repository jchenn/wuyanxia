angular.module('auth.ctrl', ['ionic'])
    .controller('LoginCtrl', function($scope, $http, $location, $ionicHistory, Loading,  AjaxService, Validate, InfoPopupService, PersonalInfo, PersonalInfoMange) {
        // 模拟
        $scope.formData = {
            'email': "hztest@corp.netease.com",
            'password': "123456"
        };
        // $scope.formData = {};
        $scope.errorData = {};
        console.log($scope.myForm);
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            console.log('clear history 1');
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });
        $scope.changePwd = function() {
            InfoPopupService('窝还没被整出来%>_<%');
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
                }
                console.log($scope.errorData);
            } else {
                // 显示loading
                Loading.show('正在登录…');
                // 没有错误信息就登录
                console.log("登录");
                console.log($scope.formData);
                console.log(JSON.stringify($scope.formData));
                var stringData = JSON.stringify($scope.formData);

                AjaxService.login().save({}, $scope.formData, function(resp) {
                    //成功
                    console.log(resp.result);
                    Loading.hide();
                    if (resp.result == 0) {
                        // InfoPopupService({text:"123"});
                        InfoPopupService(resp.info);
                    } else if (resp.result == 1) {
                        PersonalInfoMange.clear();
                        PersonalInfoMange.update(resp.data);
                        PersonalInfoMange.update({isLogin: 1});
                        console.log(PersonalInfo);
                        // $scope.go('/menu/people-list').replace();
                        $location.path('/menu/people-list').replace()
                    }
                }, function(resp) {
                    //失败
                    Loading.hide();
                    console.log(resp);
                    InfoPopupService(resp.info);
                });
            }
        };
    })
    .controller('RegisterCtrl', function($scope, $location, $ionicBackdrop, $ionicPopup, $timeout, Loading, AjaxService, PersonalInfoMange, InfoPopupService, Validate) {
        $scope.formData = {
            'email': "@corp.netease.com"
        //     'nickname': "黑月",
        //     'password': "123123"
        };
        // $scope.formData = {};
        $scope.errorData = {};
        // 弹层文案
        $scope.emailSucInfo = {
            title: "验证成功",
            template: "恭喜您验证成功，请填写个人信息让未来室友更加了解您吧"
        };
        $scope.emailFailInfo = {
            title: "验证失败",
            template: "对不起，验证失败了，请检测企业邮箱或重新邮箱验证"
        };
        // var toBrowserStr = '正在为您跳转';
console.log($scope.formData);
        /**
         * 弹层
         */
        // 验证弹层
        $scope.showPopup = function() {
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                // title: '已向您的企业邮箱中发出认证邮件，请查收完成邮箱验证',
                template: '已向您的企业邮箱中发出认证邮件，请查收完成邮箱验证',
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
                    userId = PersonalInfoMange.get('userId');
                    console.log(userId);
                    AjaxService.checkEmail().get({userId: userId}, function(resp){
                        if (resp.result == 1) {
                            PersonalInfoMange.update({isLogin: 1});
                            // 验证成功并跳转
                            InfoPopupService($scope.emailSucInfo, function() {
                                $location.path('/me-register');
                            });
                        } else if (resp.result == 0) {
                            // InfoPopupService(resp.info);
                            InfoPopupService($scope.emailFailInfo);
                        }
                    }, function(err) {
                        InfoPopupService('网络错误，请重试');
                        console.log(err);
                    });
                    // $scope.successPopup();
                }
            });
        };

        $scope.register = function() {
            $scope.errorEmail = false;
            $scope.errorPwd = false;
            $scope.errorNickName = false;
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
                }
                console.log($scope.errorData);
            } else {
                console.log("注册");
                //转圈圈
                Loading.show('正在注册…');
                // var res = cordova.InAppBrowser.open('http://corp.netease.com/coremail/', '_blank', 'location=yes');
                AjaxService.register().save({}, $scope.formData, function(resp){
                    console.log(resp);
                    Loading.hide();
                    if (resp.result == 1) {
                        console.log('注册请求发送成功');
                        PersonalInfoMange.update({
                            name: $scope.formData.nickname,
                            userId: resp.data.userId
                        });
                        console.log('注册resp：' + resp.userId);
                        //加判断方便本地测试
                        // if(typeof cordova !== "undefined") {
                        //     cordova.InAppBrowser.open('http://corp.netease.com/coremail/', '_blank', 'location=no');
                        // }   
                        window.location.href = 'http://corp.netease.com/coremail/'; 
                        // window.open('http://corp.netease.com/coremail/', '_blank'); 
                        // InfoPopupService(toBrowserStr, function() {
                        //     window.location.href = 'http://www.baidu.com';
                        // });
                        $scope.showPopup();
                    } else if (resp.result == 0) {
                        InfoPopupService(resp.info);
                    }
                }, function(resp){
                    //失败
                    Loading.hide();
                    console.log('注册失败');
                    console.log(resp);
                    InfoPopupService(resp.info);
                });
                // $scope.showPopup();
            }
        };
    });