angular.module('auth.ctrl', ['ionic'])
    .controller('LoginCtrl', function($scope, $http, $window, $location, $ionicHistory, $timeout, Loading,  AjaxService, InfoPopupService, PersonalInfo, PersonalInfoMange) {
        // 数据
        $scope.formData = {};
        console.log($scope.myForm);
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            console.log('clear history 1');
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });

        // 企业邮箱后缀数组
        $scope.dataset = ['corp.netease.com', 'yixin.im'];
        /**
         * email输入框后缀补全
         */
        $scope.autoInputEmail = function(e) {
            $scope.formData.email = e.target.innerHTML;
        };

        //处理底部栏随键盘上浮
        $scope.isEmailFocus = false;
        $scope.isPwdFocus = false;
        var eFooterBar = document.getElementById('m-bar');
        $scope.inputFocus = function(e) {
            if (e.target.name === 'email') {
                $scope.isEmailFocus = true;
            } else if (e.target.name === 'password') {
                $scope.isPwdFocus = true;
            }
            eFooterBar.classList.add('is-focus');
        };
        $scope.inputBlur = function(e) {
            // console.log($scope.userForm.email.$error.pattern);
            $scope.isEmailFocus = false;
            $scope.isPwdFocus = false;
            $timeout(function() {
                // 处理输入框之间直接切换的情况
                if (!$scope.isEmailFocus && !$scope.isPwdFocus) {
                    eFooterBar.classList.remove('is-focus');
                } 
            }, 250);
        };
        
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
        $scope.submitted = false;
        $scope.login = function(isValid) {
            $scope.submitted = true;
            if (isValid) {
                // 显示loading
                Loading.show('正在登录…');
                // 调试
                console.log("登录");
                console.log($scope.formData);
                //数据字符串化
                var stringData = JSON.stringify($scope.formData);
                //ajax
                AjaxService.login($scope.formData).success(function(resp) {
                    //成功
                    console.log(resp.result);
                    Loading.hide();
                    if (resp.result === 0) {
                        // 答应服务器返回的错误信息
                        InfoPopupService(resp.info);
                    } else if (resp.result === 1) {
                        //返回正确
                        
                        // 在 LocalStorage 中加入 access_token
                        $window.localStorage.setItem('access_token', resp.access_token || '');
                        //更新PersonalInfo
                        PersonalInfoMange.clear();
                        PersonalInfoMange.update(resp.data);
                        PersonalInfoMange.update({isLogin: 1});
                        console.log(PersonalInfo);
                        // 清楚缓存
                        $ionicHistory.clearHistory();
                        $ionicHistory.clearCache();
                        console.log('clear history 1');
                        //跳转个人信息页
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
    .controller('RegisterCtrl', function($scope, $window, $location, $ionicPopup, Loading, AjaxService, PersonalInfoMange, InfoPopupService) {
        $scope.formData = {};
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
        // 企业邮箱后缀数组
        $scope.dataset = ['corp.netease.com', 'yixin.im'];
        /**
         * email输入框后缀补全
         */
        $scope.autoInputEmail = function(e) {
            $scope.formData.email = e.target.innerHTML;
        };
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
                        if (resp.result === 1) {

                            // 在 LocalStorage 中加入 access_token
                            $window.localStorage.setItem('access_token', resp.access_token || '');
                            //标示登录状态
                            PersonalInfoMange.update({isLogin: 1});

                            // 验证成功并跳转
                            InfoPopupService($scope.emailSucInfo, function() {
                                $location.path('/menu/me-register');
                            });
                        } else if (resp.result === 0) {
                            // InfoPopupService(resp.info);
                            InfoPopupService($scope.emailFailInfo);
                        }
                    }).error(function(resp) {
                        InfoPopupService('网络错误，请重试');
                        console.log(resp);
                    });
                }
            });
        };
        /**
         * 注册
         */
        $scope.submitted = false;
        $scope.register = function(isVaild) {
            $scope.submitted = true;
            console.log($scope.submitted);
            //验证结果
            if (isVaild) {
                console.log("注册");
                //转圈圈
                Loading.show('正在注册…');
                // var res = cordova.InAppBrowser.open('http://corp.netease.com/coremail/', '_blank', 'location=yes');
                AjaxService.register($scope.formData).success(function(resp) {
                    console.log(resp);
                    Loading.hide();
                    if (resp.result == 1) {
                        console.log('注册请求发送成功');
                        
                        //更新PersonalInfo
                        PersonalInfoMange.clear();
                        PersonalInfoMange.update({
                            nickName: $scope.formData.nickname
                        });
                        PersonalInfoMange.update(resp.data);

                        // by @meniac 注册完成也会接收 access_token
                        if (resp.access_token) {
                            // 加了之后，自动登录会有问题
                            // $window.localStorage.setItem('access_token', resp.access_token);
                        }

                        console.log('注册resp：' + resp.userId);
                        //加判断方便本地测试
                        if(typeof cordova !== "undefined") {
                            window.location.href = 'http://corp.netease.com/coremail/'; 
                        } else {
                            window.open('http://corp.netease.com/coremail/', '_blank'); 
                        }
                        $scope.showPopup();
                    } else if (resp.result === 0) {
                        InfoPopupService(resp.info);
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
    });
    // .controller('TestCtrl', function($scope, $location, $ionicBackdrop, $ionicPopup, $timeout, Loading, AjaxService, PersonalInfoMange, InfoPopupService) {
    //     /**
    //      * 该控制器专为滚轮组件测试，无实际作用
    //      */
    //     //公司数据
    //     var data1 = [
    //         {
    //             "key":"company",
    //             "value":"网易"
    //         },
    //         {
    //             "key":"company",
    //             "value":"阿里"
    //         },
    //         {
    //             "key":"company",
    //             "value":"腾讯"
    //         },
    //         {
    //             "key":"company",
    //             "value":"小米"
    //         },
    //         {
    //             "key":"company",
    //             "value":"百度"
    //         },
    //         {
    //             "key":"company",
    //             "value":"菇街菇街"
    //         }
    //     ];
    //     //性别数据
    //     var data2 = [
    //         {
    //             "key":"sex",
    //             "value":"男"
    //         },
    //         {
    //             "key":"sex",
    //             "value":"女"
    //         }
    //     ];
    //     //当前滚轮类型缓存
    //     var type ;
    //     //添加动画
    //     $scope.animaed = CAAnimation.createAnimation({id:'region-picker'});
    //     // 选项配置
    //     var optionSet = function(data, flag) {
    //         if ($scope.animaed && flag === type) {
    //             $scope.animaed.start();
    //         } else {
    //             // 第一栏
    //             // up1 = UIPickerView.createPickerView({
    //             //     dataSource:data,
    //             //     id:'Picker1',
    //             //     constraintsId:'wower',
    //             //     kUP:{
    //             //         kUPCELLHEIGHT:26,
    //             //         kUPFRICTION:0.003
    //             //     },
    //             //     valueChange:function(data){
    //             //         $scope.up1Data = data;
    //             //     }
    //             // });
    //             // 第二栏
    //             $scope.up2Data = null;
    //             console.log($scope.up2Data);
    //             $scope.up2 = UIPickerView.createPickerView({
    //                 dataSource:data,
    //                 id:'Picker2',
    //                 constraintsId:'wower1',
    //                 kUP:{
    //                     kUPCELLHEIGHT:26,
    //                     kUPFRICTION:0.003
    //                 },
    //                 valueChange:function(data){
    //                     console.log(data);
    //                     $scope.up2Data = data;
    //                 }
    //             });
    //             $scope.animaed.start();
    //             type = data.key;
    //             console.log($scope.animaed);
    //             console.log($scope.up2Data);

    //         }
    //     };
    //     // 公司
    //     $scope.openPicker1 = function(){
    //         optionSet(data1, 'company');
    //     };
    //     // 男女
    //     $scope.openPicker2 = function(){
    //         optionSet(data2, 'sex');
    //     };
    //     //关闭按钮
    //     $scope.selectClose = function(){
    //         $scope.animaed.finish();
    //     };
    //     //选择按钮
    //     $scope.selectYes = function(){
    //         $scope.animaed.finish();
    //         // console.log($scope.up1Data);
    //         console.log($scope.up2Data);

    //         //if $scope.up1Data or $scope.up2Data is empty ,so use UPSelectRowIndexPath and UPThen

    //         // if (!$scope.up1 Data&& $scope.up) {
    //         //     $scope.up.UPSelectRowIndexPath(1).UPThen(function(indexPath,value){
    //         //         console.log(value);
    //         //     });
    //         // }

    //         if (!$scope.up2Data && $scope.up2) {
    //             $scope.up2.UPSelectRowIndexPath(1).UPThen(function(indexPath,value){
    //                 console.log(value);
    //                 $scope.up2Data = value;
    //             });
    //         }

    //         //maybe use your datasource is relatively good
    //         //data[0]  //你的数据默认选择第一行
    //     };
    // });