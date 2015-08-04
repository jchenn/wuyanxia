angular.module('me.ctrl', ['house.service'])

    //注册页面个人信息
    .controller('InfoRegister', function($scope, $http, $ionicModal, $ionicPopover,$ionicActionSheet, PersonalInfo, PersonalInfoMange,Check, $ionicHistory, DayInit, Camera){

        //从注册跳转，则清空跳转历史
        // var history = $ionicHistory.viewHistory();
        // if (history.backView.url === '/register') {
        //     $ionicHistory.clearHistory();
        // }
        console.log(DayInit);
        console.log(PersonalInfo);

        PersonalInfoMange.update(DayInit);

        console.log(PersonalInfo);
        $scope.data =  PersonalInfo;

        //格式化日期
        if(PersonalInfoMange.get('birthday') != ""){
            $scope.data.birthday = new Date(PersonalInfoMange.get('birthday')).toLocaleDateString().replace(/\//g,"-");
        }else{
            $scope.data.birthday = "";
        }

        //选择拍照或者上传照片

        $scope.showCamera = function(){
            var opts={
                width:400,
                height:300,
                method:1,
                quality:50
            };
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '拍照'},
                    {text: '从相册中选取'}
                ],
                cancelText: '取消',
                cancel: function(){
                    hideSheet();
                },
                buttonClicked: function(index){
                    if(index == 0){
                        alert('拍照');
                        Camera.getPic(function(){
                            alert('success');
                        }, function(){
                            alert('fail');
                        }, opts, 1);
                    }else if(index == 1){
                        alert('选照片');
                        Camera.getPic(function(){
                            alert('success');
                        }, function(){
                            alert('fail');
                        }, opts, 0);

                    }
                    hideSheet();
                }
            });
            $timeout(function() {
                hideSheet();
            }, 2000);
        };




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
        //出生日期模态框
        $ionicPopover.fromTemplateUrl('templates/me/birth-modal.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openBirth = function($event) {
            $scope.popover.show($event);
        };
        $scope.closeBirth = function() {
            $scope.popover.hide();
        };

        $scope.selectBirth = function(){
            $scope.data.birthday = $scope.data.year + "-" + $scope.data.month + "-" + $scope.data.day;
            $scope.closeBirth();
        };

        //跳过按钮
        $scope.ignoreRegister = function(){
            if(!$scope.data.tags){
                $scope.go('/quiz/hint');
            }else{
                $scope.go('/menu/people-list');
            }
        };

        //日历
        $scope.data.yearArr = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995];
        $scope.data.monthArr = [1,2,3,4,5,6,7,8,9,10,11,12];
        $scope.data.dayArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

        $scope.selectMonth = function(){
            $scope.data.dayArr = [];
            var curMonth = parseInt($scope.data.month);
            switch (curMonth) {
                case 2:
                    for (var i = 1; i < 29; i++) {
                        $scope.data.dayArr.push(i);
                    }
                    break;
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    for (var k = 1; k < 32; k++) {
                        $scope.data.dayArr.push(k);
                    }
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    for (var o = 1; o < 31; o++) {
                        $scope.data.dayArr.push(o);
                    }
                    break;
                default :
                    alert('this is a mistake');

            }

        };



        //提交数据
        $scope.finishRegister = function(){
            //检查数据
            if(Check.getLen($scope.data.gender) < 1){
                alert("请选择性别");
                return false;
            }
            if(Check.getLen($scope.data.company) < 1 || Check.getLen($scope.data.company) > 30){
                alert("公司名称不能为空或过长");
                return false;
            }
            if(Check.getLen($scope.data.job) < 1 || Check.getLen($scope.data.job) > 30){
                alert("岗位名称不能为空或过长");
                return false;
            }
            if(!Check.checkPrice($scope.data.phone)  || Check.getLen($scope.data.phone) != 11){
                alert("电话必须为11位的数字");
                return false;
            }

            var sendData = {
                'nickName' : $scope.data.nickName,
                'gender' : $scope.data.gender,
                'birthday': new Date($scope.data.birthday).valueOf(),
                'company': $scope.data.company,
                'job' : $scope.data.job,
                'phone' : $scope.data.phone
            };

            //给服务器发请求
            var res = $http({
                method: 'post',
                url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                data: sendData,
                timeout: 2000
            });

            res.success(function(response, status, headers, config){
                console.log(response);
                if(response.errno == 0){
                    PersonalInfoMange.update($scope.data);
                    PersonalInfoMange.update({'completeInfo' : true});
                    if(!PersonalInfoMange.get('tags')){
                        $scope.go('/quiz/hint');
                    }else{
                        $scope.go('/menu/people-list');
                    }
                }else if(response.errno == 1){
                    alert(response);
                }
            }).error(function(response, status, headers, config){
                console.log(response);
            });
        }
    }).controller('InfoShow', function($scope, $ionicActionSheet, $ionicModal, $ionicPopover, $timeout, PersonalInfo ,$http, PersonalInfoMange, DayInit){
        console.log(1111);
        console.log(PersonalInfo);
        angular.extend(PersonalInfo, DayInit);
        $scope.data = PersonalInfo;
        console.log(PersonalInfo);

        if(PersonalInfoMange.get('birthday') != ""){
            $scope.data.birthday =  new Date(PersonalInfoMange.get('birthday')).toLocaleDateString().replace(/\//g,"-");
        }else{
            $scope.data.birthday = "";
        }
        //angular.extend(PersonalInfo, DayInit);
        //console.log(PersonalInfo);
        //console.log(PersonalInfo);
        console.log($scope.data);


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
                        res.success(function(response, status, headers, config){
                            if(response.errno == 0){
                                PersonalInfoMange.update({'lookStatus': $scope.data.lookStatus});
                            }else if(response.errno == 1){
                                console.log(response.errno);
                            }
                        }).error(function(response, status, headers, config){
                            console.log(response);
                        });
                    }

                    hideSheet();
                }
            });
            $timeout(function() {
                hideSheet();
            }, 2000);
        };

        $scope.modify = function(obj){
            PersonalInfo.title = obj.title;
            PersonalInfo.val = obj.val;
            PersonalInfo.key = obj.key;
            $scope.go('/me-editor');
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
                        alert(response);
                    }
                }).error(function(response, status, headers, config){
                    console.log(response);
                });
            }
            $scope.closeSex();
        };
        //出生日期模态框
        $ionicPopover.fromTemplateUrl('templates/me/birth-modal.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openBirth = function($event) {
            $scope.popover.show($event);
        };
        $scope.closeBirth = function() {
            $scope.popover.hide();
        };

        $scope.selectBirth = function(){

            DayInit.year = $scope.data.year;
            DayInit.month = $scope.data.month;
            DayInit.day = $scope.data.day;

            $scope.data.birthday = $scope.data.year + "-" + $scope.data.month + "-" + $scope.data.day;

            var obj = {};
            obj['birthday'] = new Date($scope.data.birthday).valueOf();
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
                    PersonalInfoMange.update($scope.data.birthday);

                    $scope.go('/me');
                }else if(response.errno == 1){
                    alert(response.message);
                }
            }).error(function(response, status, headers, config){
                alert(response.message);
            });

            $scope.closeBirth();
        };

        //日历

        $scope.selectMonth = function() {
            $scope.data.dayArr = [];
            var curMonth = parseInt($scope.data.month);
            switch (curMonth) {
                case 2:
                    for (var i = 1; i < 29; i++) {
                        $scope.data.dayArr.push(i);
                    }
                    break;
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    for (var k = 1; k < 32; k++) {
                        $scope.data.dayArr.push(k);
                    }
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    for (var o = 1; o < 31; o++) {
                        $scope.data.dayArr.push(o);
                    }
                    break;
                default :
                    alert('this is a mistake');

            }

        }
        //与注册信息页面重复的代码 end
    })
    //修改个人信息控制器
    .controller('EditorInfo', function($scope, $http, PersonalInfo, PersonalInfoMange, Check){
        $scope.data = PersonalInfo;
        $scope.saveModify = function(){

            var obj = {};
            obj[$scope.data.key] = $scope.data.val;

            if(Check.getLen( $scope.data.val) < 1 || Check.getLen( $scope.data.val) > 30){
                alert("不能为空或过长");
                return false;
            }
            if($scope.data.key == 'phone'){
                if(!Check.checkPrice($scope.data.val)  || Check.getLen( $scope.data.val) != 11){
                    alert("电话必须为11位的数字");
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
            res.success(function(response, status, headers, config){
                if(response.errno == 0){
                    if(response.finishInfo == 1){
                        PersonalInfoMange.update({'completeInfo' : true});
                    }
                    PersonalInfoMange.update(obj);

                    $scope.go('/me');
                }else if(response.errno == 1){
                    alert(response.message);
                }
            }).error(function(response, status, headers, config){
                alert(response.message);
            });
        }
    }).controller('scrollCalendar',function($scope){

        $scope.scrollUp = function(){
            alert('scroll up');
        };
        $scope.scrollDown = function(){
            alert('scroll down');
        }

    })

;