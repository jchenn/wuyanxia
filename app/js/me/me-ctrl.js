angular.module('me.ctrl', [])

    //注册页面个人信息
    .controller('InfoRegister', function($scope, $timeout,$ionicPopup, $http, $ionicModal, $ionicPopover,$ionicActionSheet,event,TakePhoto,dateSelect, PersonalInfo, PersonalInfoMange,Check, $ionicHistory){

        $scope.data = {};
        angular.extend($scope.data,PersonalInfo);

        //调用摄像头
        $scope.showCamera = function(){
            TakePhoto.showCamera(0,function(imageData){
                $scope.data.avatar = imageData;
            });
        };

        //加载性别选择模板
        $ionicModal.fromTemplateUrl('templates/me/sex-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.modal = modal;
        });

        //显示modal
        $scope.openSex = function(){
            $scope.modal.show();
        };

        //隐藏modal
        $scope.closeSex = function(){
            $scope.modal.hide();
        };

        //选择性别
        $scope.selectSex = function(sex){
            $scope.data.gender = sex;
            $scope.closeSex();
        };

        //显示日期选择框
        $scope.showDate = function(){
            dateSelect.showDate($scope);
        };

        //跳过按钮
        $scope.ignoreRegister = function(){
            if(!$scope.data.tags){
                $scope.go('/quiz');
            }else{
                $scope.go('/menu/people-list');
            }
        };

        //提交数据
        $scope.finishRegister = function(){

            //检查数据
            if(Check.getLen($scope.data.avatar) < 1 || $scope.data.avatar == "http://223.252.223.13/Roommates/photo/photo_default.jpg"){
                $ionicPopup.alert({
                    template: '请上传头像'
                });
                return false;
            }

            if(Check.getLen($scope.data.nickName) < 1 || Check.getLen($scope.data.nickName) > 30){
                $ionicPopup.alert({
                    template:"昵称不能为空或者大于15个汉字"
                });
                return false;
            }

            if(Check.getLen($scope.data.gender) < 1){
                $ionicPopup.alert({
                    template:"请选择性别"
                });
                return false;
            }

            if(Check.getLen($scope.data.birthday) < 1){
                $ionicPopup.alert({
                    template:"请选择出生日期"
                });
                return false;
            }

            if(Check.getLen($scope.data.company) < 1 || Check.getLen($scope.data.company) > 30){
                $ionicPopup.alert({
                    template: "公司名称不能为空或过长"
                });
                return false;
            }

            if(Check.getLen($scope.data.job) < 1 || Check.getLen($scope.data.job) > 30){
                $ionicPopup.alert({
                    template: "岗位名称不能为空或过长"
                });
                return false;
            }

            if(!Check.checkPrice($scope.data.phone)  || Check.getLen($scope.data.phone) != 11){
                $ionicPopup.alert({
                    template: "电话必须为11位的数字"
                });
                return false;
            }

            //组装用户填写数据为对象
            var sendData = {
                'nickName' : $scope.data.nickName,
                'gender' : $scope.data.gender,
                'birthday': new Date($scope.data.birthday).valueOf(),
                'company': $scope.data.company,
                'job' : $scope.data.job,
                'phone' : $scope.data.phone
            };

            //先上传头像，然后把照片存到本地缓存
            TakePhoto.uploadPic($scope.data.avatar);
            PersonalInfoMange.update({'avatar' : $scope.data.avatar});

            //给服务器发请求
            var res = $http({
                method: 'post',
                url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                data: sendData,
                timeout: 2000
            });

            res.success(function(response){

                if(response.errno == 0){
                    PersonalInfoMange.update($scope.data);
                    PersonalInfoMange.update({'completeInfo' : true});

                    if(!PersonalInfoMange.get('tags')){
                        $scope.go('/quiz');
                    }else{
                        $scope.go('/menu/people-list');
                    }

                }else if(response.errno == 1){
                    $ionicPopup.alert({
                        template: response
                    });
                }
            }).error(function(response){
                $ionicPopup.alert({
                    template: response
                });
            });
        }
    }).controller('InfoShow', function($scope, $ionicActionSheet,$ionicPopup, $ionicModal,dateSelect,TakePhoto, $ionicPopover, $timeout, PersonalInfo ,$http, PersonalInfoMange){

        $scope.data = PersonalInfo;

        //调用摄像头
        $scope.showCamera = function(){

            TakePhoto.showCamera(1,function(imageData){
                $scope.data.avatar = imageData;
            });

        };

        //显示日期选择框
        $scope.showDate = function(){

            dateSelect.showDate($scope , $http,1);

        };

        $scope.showStatus = function(){

            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '正在寻找'},
                    {text: '已经找到'}
                ],
                cancelText: '取消',
                cancel: function(){
                    hideSheet();
                },
                buttonClicked: function(index){

                    //缓存原本的状态，如果所选的状态跟原本的相同，就不发送请求
                    var temp = PersonalInfoMange.get('lookStatus');
                    $scope.data.lookStatus = index == 0 ? 0 : 1;

                    if(temp != $scope.data.lookStatus){
                        var obj = {
                            'lookStatus' : $scope.data.lookStatus
                        };
                        var res = $http({
                            method: 'post',
                            url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                            data: obj,
                            timeout: 2000
                        });
                        res.success(function(response){

                            if(response.errno == 0){
                                PersonalInfoMange.update({'lookStatus': $scope.data.lookStatus});
                            }else if(response.errno == 1){
                                $ionicPopup.alert({
                                    template: response.errno
                                });
                            }

                        }).error(function(response){

                            $ionicPopup.alert({
                                template: response
                            });

                        });
                    }

                    hideSheet();
                }
            });
        };

        //修改页面带上值，保存值
        $scope.modify = function(obj){
            PersonalInfo.title = obj.title;
            PersonalInfo.val = obj.val;
            PersonalInfo.key = obj.key;
            $scope.go('/menu/me-editor');
        };

        //与注册信息页面重复的代码 start
        $ionicModal.fromTemplateUrl('templates/me/sex-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.modal = modal;
        });

        //显示modal
        $scope.openSex = function(){
            $scope.modal.show();
        };

        //隐藏modal
        $scope.closeSex = function(){
            $scope.modal.hide();
        };

        //选择性别
        $scope.selectSex = function(sex){
            var temp = $scope.data.gender;
            if(temp == sex){
                $scope.closeSex();
            }else{
                var obj = {};
                obj['gender']  = sex;
                PersonalInfoMange.update(obj);
                //给服务器发请求
                var res = $http({
                    method: 'post',
                    url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                    data: obj,
                    timeout: 2000
                });
                res.success(function(response, status, headers, config){
                    if(response.errno == 0){
                        if(response.finishInfo == 1){
                            PersonalInfoMange.update({'completeInfo' : true});
                        }
                        return true;
                    }else if(response.errno == 1){
                        $ionicPopup.alert({
                            template: response
                        });
                    }
                }).error(function(response){
                    $ionicPopup.alert({
                        template: response
                    });
                });
            }
            $scope.closeSex();
        };
    })

    //修改个人信息控制器
    .controller('EditorInfo', function($scope, $http,$ionicPopup, PersonalInfo, PersonalInfoMange, Check){
        $scope.data = PersonalInfo;
        $scope.saveModify = function(){

            var obj = {};
            obj[$scope.data.key] = $scope.data.val;

            if(Check.getLen( $scope.data.val) < 1 || Check.getLen( $scope.data.val) > 30){
                $ionicPopup.alert({
                    template: '不能为空或过长'
                });
                return false;
            }
            if($scope.data.key == 'phone'){
                if(!Check.checkPrice($scope.data.val)  || Check.getLen( $scope.data.val) != 11){
                    $ionicPopup.alert({
                        template: '电话必须为11位的数字'
                    });
                    return false;
                }
            }

            //给服务器发请求
            var res = $http({
                method: 'post',
                url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                data: obj,
                timeout: 2000
            });
            res.success(function(response){

                if(response.errno == 0){
                    if(response.finishInfo == 1){
                        PersonalInfoMange.update({'completeInfo' : true});
                    }
                    PersonalInfoMange.update(obj);

                    $scope.go('/menu/me');
                }else if(response.errno == 1){
                    $ionicPopup.alert({
                            template: response.message
                        });
                }

            }).error(function(response){

                $ionicPopup.alert({
                    template: response.message
                });

            });
        };

        $scope.clearValue = function(){
            document.getElementById('textField').value = "";
        }
    })
;