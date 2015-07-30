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
    .controller('InfoRegister', function($scope, $http, $ionicModal, $ionicPopover, PersonalInfo, PersonalInfoMange){

        $scope.data =  PersonalInfo;

        $ionicModal.fromTemplateUrl('sex-modal.html', {
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
        $ionicPopover.fromTemplateUrl('birth-modal.html', {
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


        //提交数据
        $scope.finishRegister = function(){
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
                    console.log('个人资料不能为空');
                }
            }).error(function(response, status, headers, config){
                console.log(response);
            });
        }
    }).controller('InfoShow', function($scope, $ionicActionSheet, $timeout, PersonalInfo ,$http, PersonalInfoMange){

        $scope.data = PersonalInfo;
        $scope.showStatus = function(){
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '正在寻找'},
                    {text: '已经找到'}
                ],
                cancelText: 'Cancel',
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
    })
    //修改个人信息控制器
    .controller('EditorInfo', function($scope, $http, PersonalInfo){
        $scope.data = PersonalInfo;
        $scope.saveModify = function(){
            //给服务器发请求
            var res = $http({
                method: 'post',
                url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                data: $scope.data,
                timeout: 2000
            });
            res.success(function(response, status, headers, config){
                if(response.errno == 0){
                    var key =  $scope.data.key;
                    var val = $scope.data.val;
                    PersonalInfoMange.update({ key : val });
                    $scope.go('/me');
                }else if(response.errno == 1){
                    console.log(response);
                }
            }).error(function(response, status, headers, config){
                console.log(response);
            });
        }
    })
    //验证控制器

    .controller('Validate', function($scope){
        $scope.data = {};

        $scope.getCode = function(){

        }
    })
;