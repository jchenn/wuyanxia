angular.module('auth.ctrl', ['ionic'])

.controller('LoginCtrl', function($scope, LoginService, Validate) {
  $scope.formData = {};
  $scope.errorData = {};
  console.log($scope.myForm);
  $scope.login = function() {

  };
  $scope.login = function() {
  	$scope.errorEmail = false;
  	$scope.errorPwd = false;
  	// 验证表单
  	$scope.errorData = Validate($scope.formData, false);

  	if ($scope.errorData.text) {
		if ($scope.errorData.name == "email") {
	  		$scope.errorEmail = true;
	  	} else if($scope.errorData.name == "pwd"){
	  		$scope.errorPwd = true;
	  	};
	  	console.log($scope.errorData);
  	} else {
  		console.log("登录");
  	}
  	// LoginService.save({}, $scope.formData, function(response){
  	// 	//成功
  	// }, function(response){
  	// 	//失败
  	// })


  	// $http({
   //      method  : 'POST',
   //      url     : 'process.php',
   //      data    : $.param($scope.formData),  // pass in data as strings
   //      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
   //  })
   //  .success(function(data) {
   //      console.log(data);

   //      if (!data.success) {
   //          // if not successful, bind errors to error variables
   //          $scope.errorName = data.errors.name;
   //          $scope.errorSuperhero = data.errors.superheroAlias;
   //      } else {
   //          // if successful, bind success message to message
   //          $scope.message = data.message;
   //      }
   //  });
  }

})

.controller('RegisterCtrl', function($scope, $ionicBackdrop, $ionicPopup, $timeout, RegisterService, Validate) {
	$scope.formData = {};
	$scope.errorData = {};
	console.log($scope.formData);
	$scope.login = function() {

	};
	$scope.register = function() {
		$scope.errorEmail = false;
		$scope.errorPwd = false;
		$scope.errorNickName = false;
		// 验证表单
		// $scope.errorData = Validate($scope.formData, false);

		// 模拟
		$scope.errorData = {};
		

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
			console.log("邮箱验证");
		}

		// 蒙板
		$scope.action = function() {
			$ionicBackdrop.retain();
			$timeout(function() {
			  $ionicBackdrop.release();
			}, 1000);
		};
		$scope.action(); 
		
		//弹层
		$scope.showPopup = function() {
			$scope.data = {}
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				// template: '<input type="password" ng-model="data.wifi">',
				title: '已向您的企业邮箱中发出认证邮件，请查收完成邮箱验证',
				scope: $scope,
				buttons: [
				  { text: '还未验证' },
				  {
				    text: '<b>已验证完成</b>',
				    type: 'button-positive',
				    onTap: function(e) {
				    	// 测试
				    	myPopup.close();
				    	console.log(123);
				    	$scope.successPopup();

						// RegisterService.save({}, $scope.formData, function(response){
						// 	//成功
						// }, function(response){
						// 	//失败
						// })				    	

				    }
				  }
				]
			});
		}
		$scope.showPopup();
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
	}
});

