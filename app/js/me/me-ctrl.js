angular.module('me.ctrl', [])

// 处理个性问答的控制器
.controller('QuestionCtrl', function($scope, $stateParams, $http, QuestionList) {

  // 问卷序号，从 1 开始
  var id = ~~$stateParams.id;

  $scope.id           = id;
  $scope.nextOrFinish = '下一题';
  $scope.showHint     = false;
  $scope.question     = QuestionList[id - 1];
  $scope.styleLeft    = 16.6667 * id - 16.6667;

  // console.log($scope.question);

  // 对第一题和最后一题的界面做额外处理
  if (id === 1) {

    // 添加第一页做问题的提示
    $scope.showHint = true;

  } else if (id === QuestionList.length) {

    // 修改最后一题的提示按钮
    $scope.nextOrFinish = '完成'

  }

  $scope.next = function() {
    
    // console.log(id);

    if (id >= 1 && id < QuestionList.length) {

      $scope.go('/me/q/' + (id + 1));

    } else {

      // 完成问题，跳转到筛选页面
      $scope.go('/menu/people');

    }
  }

})
    //注册页面个人信息
    .controller('InfoRegister', function($scope, $http, $ionicModal, $ionicPopover, PersonalInfo){

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
            PersonalInfo = $scope.data;
            //给服务器发请求
            var res = $http({
                method: 'post',
                url: '/personal-info',
                data: $scope.data,
                timeout: 2000
            });
            res.success(function(response, status, headers, config){
                console.log(response);
            }).error(function(response, status, headers, config){
                console.log(response);
            });
            $scope.go('/me/q/1');
        }
    }).controller('InfoShow', function($scope, $ionicActionSheet, $timeout, PersonalInfo){

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
                    $scope.data.lookStatus = index == 0 ? "正在寻找" : "已经找到";
                    PersonalInfo.lookStatus = $scope.data.lookStatus;
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
            PersonalInfo[$scope.data.key] = $scope.data.val;
            //给服务器发请求
            var res = $http({
                method: 'post',
                url: '/personal-info',
                data: $scope.data,
                timeout: 2000
            });
            res.success(function(response, status, headers, config){
                console.log(response);
            }).error(function(response, status, headers, config){
                console.log(response);
            });
            $scope.go('/me');
        }
    })
    //验证控制器
    .controller('Validate', function($scope){
        $scope.data = {};

        $scope.getCode = function(){

        }
    })
;