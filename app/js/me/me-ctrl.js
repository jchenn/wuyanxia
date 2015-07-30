angular.module('me.ctrl', [])

// 处理个性问答的控制器
.controller('QuestionCtrl', 
  function($scope, $stateParams, $ionicPopup, $ionicLoading, $http, QuizModel, QuizSubmit) {

  // 问卷序号，从 1 开始
  var number = ~~$stateParams.number,
      quiz   = QuizModel.quiz;

  // console.log(quiz);

  $scope.number       = number;
  $scope.nextOrFinish = '下一题';
  $scope.showHint     = false;
  $scope.question     = quiz[number - 1];
  $scope.styleLeft    = 16.6667 * number - 16.6667;

  // console.log($scope.question);

  // 对第一题和最后一题的界面做额外处理
  if (number === 1) {

    // 添加第一页做问题的提示
    $scope.showHint = true;

  } else if (number === quiz.length) {

    // 修改最后一题的提示按钮
    $scope.nextOrFinish = '完成';

  }

  $scope.next = function() {
    
    // console.log(id);

    if (number >= 1 && number < quiz.length) {

      $scope.go('/me/q/' + (number + 1));

    } else {

      // 完成问题，跳转到筛选页面
      // console.log('完成答题');
      $ionicLoading.show();

      QuizSubmit.submit(QuizModel.get(), function(response) {
        // console.log(response);

        if (response.errno === 0) {

          $ionicLoading.hide();

          $ionicPopup.alert({
            template: '完成答题'
          }).then(function(res) {
            $scope.go('/menu/people-list');
          });

        }
      }, function(err) {
        console.log('err', err);
      })
    }
  };

  $scope.select = function(name, value) {

    QuizModel.set(name, value);
    // console.log(QuizModel.get());

    // 如果有房源，则要判断是否现在发布
    if (name == 'yf' && value == 2) {

      $ionicPopup.confirm({
        template: '要不要先描述一下房源，为招到合租室友做好准备？',
        okText: '好的',
        cancelText: '一会儿再说'
      }).then(function(res) {
        // console.log(res);
        if (res) {
          // TODO: 跳转到发布房源的界面
          $scope.go('/house-new');
        } else {
          $scope.next();
        }
      });
    } else {
      $scope.next();
    }
  };

})
    //注册页面个人信息
    .controller('InfoRegister', function($scope, $http, $ionicModal, $ionicPopover, PersonalInfo, PersonalInfoMange,Check, $ionicHistory){

        //从注册跳转，则清空跳转历史
        var history = $ionicHistory.viewHistory();
        if (history.backView.url === '/register') {
            $ionicHistory.clearHistory();
        }
        $scope.data =  PersonalInfo;

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
            $scope.data.sex = sex;
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
            $scope.data.birth = $scope.data.year + "-" + $scope.data.month + "-" + $scope.data.day;
            $scope.closeBirth();
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
            if(Check.getLen($scope.data.sex) < 1){
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
            //给服务器发请求
            var res = $http({
                method: 'post',
                url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                data: $scope.data,
                timeout: 2000
            });
            res.success(function(response, status, headers, config){
                console.log(response);
                if(response.errno == 0){
                    PersonalInfoMange.update($scope.data);
                    $scope.go('/me/q/1');
                }else if(response.errno == 1){
                    alert(response.message);
                }
            }).error(function(response, status, headers, config){
                console.log(response);
            });
        }
    }).controller('InfoShow', function($scope, $ionicActionSheet, $ionicModal, $ionicPopover, $timeout, PersonalInfo ,$http, PersonalInfoMange){

        $scope.data = PersonalInfo;
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
                        var res = $http({
                            method: 'post',
                            url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                            data: $scope.data,
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
        }

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
            var temp = $scope.data.sex;
            if(temp == sex){
                $scope.closeSex();
            }else{
                var obj = {};
                obj['sex']  = sex;
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
            $scope.data.birth = $scope.data.year + "-" + $scope.data.month + "-" + $scope.data.day;

            var obj = {};
            obj['birth'] = $scope.data.birth;
            //给服务器发请求
            var res = $http({
                method: 'post',
                url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                data: obj,
                timeout: 2000
            });
            res.success(function(response, status, headers, config){
                if(response.errno == 0){

                    PersonalInfoMange.update(obj);

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
        $scope.data.yearArr = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995];
        $scope.data.monthArr = [1,2,3,4,5,6,7,8,9,10,11,12];
        $scope.data.dayArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

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
                if(!Check.checkPrice($scope.data.phone)  || Check.getLen($scope.data.phone) != 11){
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

                    PersonalInfoMange.update(obj);

                    $scope.go('/me');
                }else if(response.errno == 1){
                    alert(response.message);
                }
            }).error(function(response, status, headers, config){
                alert(response.message);
            });
        }
    })

;