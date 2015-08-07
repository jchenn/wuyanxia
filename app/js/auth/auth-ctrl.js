angular.module('auth.ctrl', ['ionic'])
    .controller('LoginCtrl', function($scope, $http, $window, $location, $ionicHistory, Loading,  AjaxService, Validate, InfoPopupService, PersonalInfo, PersonalInfoMange) {
        // 数据
        $scope.formData = {
            // 'email': "hzlbl4@corp.netease.com",
            // 'password': "123456"
        };
        $scope.errorData = {};
        console.log($scope.myForm);
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            console.log('clear history 1');
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });
        /**
         * 忘记密码函数
         * @return {[type]} [description]
         */
        $scope.changePwd = function() {
            InfoPopupService('窝还没被整出来%>_<%');
        };
        /**
         * 登录函数
         * @return {[type]} [description]
         */
        $scope.login = function() {
            $scope.errorEmail = false;
            $scope.errorPwd = false;
            // 验证表单
            console.log($scope.formData);
            var flag = Validate($scope, $scope.formData, false);
            if (!flag) {

                // 显示loading
                Loading.show('正在登录…');
                
                console.log("登录");
                console.log($scope.formData);
                console.log(JSON.stringify($scope.formData));
                //数据字符化
                var stringData = JSON.stringify($scope.formData);
                //ajax
                AjaxService.login($scope.formData).success(function(resp) {
                    //成功
                    console.log(resp.result);
                    Loading.hide();
                    if (resp.result == 0) {
                        // 答应服务器返回的错误信息
                        InfoPopupService(resp.data.info);
                    } else if (resp.result == 1) {
                        //返回正确
                        
                        // 在 LocalStorage 中加入 access_token
                        $window.localStorage.setItem('access_token', resp.access_token || '');
                        //更新PersonalInfo
                        PersonalInfoMange.clear();
                        PersonalInfoMange.update(resp.data);
                        PersonalInfoMange.update({isLogin: 1});
                        console.log(PersonalInfo);

                        // $scope.go('/menu/people-list').replace();
                        // $location.path('/menu/people-list').replace()
                        $scope.go('/menu/people-list');
                    }
                }).error(function(resp){
                    //请求失败
                    Loading.hide();
                    console.log(resp);
                    InfoPopupService(resp);
                });
                
            }
        };
    })
    .controller('RegisterCtrl', function($scope, $window, $location, $ionicBackdrop, $ionicPopup, $timeout, Loading, AjaxService, PersonalInfoMange, InfoPopupService, Validate) {
        $scope.formData = {
            // 'email': "@corp.netease.com"
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
                    AjaxService.checkEmail({userId: userId}).success(function(resp) {
                        if (resp.result == 1) {
                            PersonalInfoMange.update({isLogin: 1});

                            // 在 LocalStorage 中加入 access_token
                            $window.localStorage.setItem('access_token', resp.access_token || '');

                            // 验证成功并跳转
                            InfoPopupService($scope.emailSucInfo, function() {
                                $location.path('/me-register');
                            });
                        } else if (resp.result == 0) {
                            // InfoPopupService(resp.data.info);
                            InfoPopupService($scope.emailFailInfo);
                        }
                    }).error(function(resp) {
                        InfoPopupService('网络错误，请重试');
                        console.log(resp);
                    })
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
            var flag = Validate($scope, $scope.formData, true);
            // 模拟
            // $scope.errorData = {};
            //验证结果
            if (!flag) {
                console.log("注册");
                //转圈圈
                Loading.show('正在注册…');
                // var res = cordova.InAppBrowser.open('http://corp.netease.com/coremail/', '_blank', 'location=yes');
                AjaxService.register($scope.formData).success(function(resp) {
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
                        InfoPopupService(resp.data.info);
                    }
                }).error(function(resp) {
                    //失败
                    Loading.hide();
                    console.log('注册失败');
                    console.log(resp);
                    InfoPopupService(resp);
                });
                
            }
        };
    })
    .controller('TestCtrl', function($scope, $location, $ionicBackdrop, $ionicPopup, $timeout, Loading, AjaxService, PersonalInfoMange, InfoPopupService, Validate) {
        //公司数据
        var data1 = [
            {
                "key":"company",
                "value":"网易"
            },
            {
                "key":"company",
                "value":"阿里"
            },
            {
                "key":"company",
                "value":"腾讯"
            },
            {
                "key":"company",
                "value":"小米"
            },
            {
                "key":"company",
                "value":"百度"
            },
            {
                "key":"company",
                "value":"菇街菇街"
            }
        ];
        //性别数据
        var data2 = [
            {
                "key":"sex",
                "value":"男"
            },
            {
                "key":"sex",
                "value":"女"
            }
        ];
        //当前滚轮类型缓存
        var type ;
        //添加动画
        $scope.animaed = CAAnimation.createAnimation({id:'region-picker'});
        // 选项配置
        var optionSet = function(data, flag) {
            if ($scope.animaed && flag === type) {
                $scope.animaed.start();
            } else {
                // 第一栏
                // up1 = UIPickerView.createPickerView({
                //     dataSource:data,
                //     id:'Picker1',
                //     constraintsId:'wower',
                //     kUP:{
                //         kUPCELLHEIGHT:26,
                //         kUPFRICTION:0.003
                //     },
                //     valueChange:function(data){
                //         $scope.up1Data = data;
                //     }
                // });
                // 第二栏
                $scope.up2Data = null;
                console.log($scope.up2Data);
                $scope.up2 = UIPickerView.createPickerView({
                    dataSource:data,
                    id:'Picker2',
                    constraintsId:'wower1',
                    kUP:{
                        kUPCELLHEIGHT:26,
                        kUPFRICTION:0.003
                    },
                    valueChange:function(data){
                        console.log(data);
                        $scope.up2Data = data;
                    }
                });
                $scope.animaed.start();
                type = data.key;
                console.log($scope.animaed);
                console.log($scope.up2Data);

            }
        };
        // 公司
        $scope.openPicker1 = function(){
            optionSet(data1, 'company');
        };
        // 男女
        $scope.openPicker2 = function(){
            optionSet(data2, 'sex');
        };
        //关闭按钮
        $scope.selectClose = function(){
            $scope.animaed.finish();
        };
        //选择按钮
        $scope.selectYes = function(){
            $scope.animaed.finish();
            // console.log($scope.up1Data);
            console.log($scope.up2Data);

            //if $scope.up1Data or $scope.up2Data is empty ,so use UPSelectRowIndexPath and UPThen

            // if (!$scope.up1 Data&& $scope.up) {
            //     $scope.up.UPSelectRowIndexPath(1).UPThen(function(indexPath,value){
            //         console.log(value);
            //     });
            // }

            if (!$scope.up2Data && $scope.up2) {
                $scope.up2.UPSelectRowIndexPath(1).UPThen(function(indexPath,value){
                    console.log(value);
                    $scope.up2Data = value;
                });
            }

            //maybe use your datasource is relatively good
            //data[0]  //你的数据默认选择第一行
        };
    });