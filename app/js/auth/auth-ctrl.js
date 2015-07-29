angular.module('auth.ctrl', ['ionic'])
.controller('LoginCtrl', function($scope, $http, LoginService, Validate) {
	$scope.formData = {
		'email': "123@123.com",
		'password': "123123"
	};
	$scope.errorData = {};
	console.log($scope.myForm);
	$scope.changePwd = function() {
		alert('老子还没被整出来');
	};
	$scope.login = function() {
	    $scope.errorEmail = false;
	    $scope.errorPwd = false;
	    // 验证表单
	    $scope.errorData = Validate($scope.formData, false);
	    if ($scope.errorData.text) {
	        if ($scope.errorData.name == "email") {
	            $scope.errorEmail = true;
	        } else if($scope.errorData.name == "password"){
	            $scope.errorPwd = true;
	        };
	        console.log($scope.errorData);
	    } else {
	        console.log("登录");
	        // $http({
	        //  method: 'POST',
	        //  url: 'http://223.252.223.13/api/login',
	        //  data: $scope.formData
	        // })
	        // .success(function (data) {
	        //  console.log(data);
	        // })
	        // .error(function (data) {
	        //  console.log(data);
	        // });
	        // LoginService.save({}, $scope.formData, function(response){
	        //  //成功
	        //  console.log(response);
	        // }, function(response){
	        //  //失败
	        //  console.log(response);
	        // })
	    }
	}
})
.controller('RegisterCtrl', function($scope, $ionicBackdrop, $ionicPopup, $timeout, RegisterService, CheckService, Validate) {
    $scope.formData = {};
    $scope.errorData = {};
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
            $scope.data = {}
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                // template: '<input type="password" ng-model="data.wifi">',
                title: '已向您的企业邮箱中发出认证邮件，请查收完成邮箱验证',
                scope: $scope,
                buttons: [
                  { text: '还未验证'},
                  {
                    text: '<b>已验证完成</b>',
                    type: 'button-positive',
                    onTap: function() {
                        return true;
                    }
                  }
                ]
            });
            myPopup.then(function(res){
                if (res === true) {
                    // CheckService.get({userId:'213'}, function(resp){
                    //  $scope.successPopup();
                    // }, function(err) {
                    //  $scope.failPopup();
                    // })
                    $scope.successPopup();
                }                   
            })
        }
        // $scope.showPopup();
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
        // 弹层：信息弹层
        $scope.infoPopup = function(msg) {
            var myPopup = $ionicPopup.show({
                title: msg
            });
            $timeout(function() {
                myPopup.close(); 
            }, 1500);
        }
        /**
         * 验证表单
         */
        // $scope.errorData = Validate($scope.formData, true);
        // 模拟
        $scope.errorData = {};
        //验证结果
        if ($scope.errorData.text) {
            if ($scope.errorData.name == "email") {
                $scope.errorEmail = true;
            } else if($scope.errorData.name == "nickName"){
                $scope.errorNickName = true;
            } else if($scope.errorData.name == "pwd"){
                $scope.errorPwd = true;
            };
            console.log($scope.errorData);
        } else {
            console.log("注册");
            var ref = cordova.InAppBrowser.open('http://www.baidu.com', '_blank', 'location=yes');
            // RegisterService.save({}, $scope.formData, function(res){
      //            //成功
      //            console.log('注册成功');
      //            console.log(res);
      //            if (res.result == 1) {
            //      $scope.showPopup();
      //            } else if (res.result == 0) {
                        // $scope.infoPopup(res.info);
      //            };
         //     }, function(res){
         //         //失败
                // console.log('注册失败');
                // console.log(response);
                // $scope.infoPopup(res.info);
         //     })
            $scope.showPopup();
        }
    }
});
