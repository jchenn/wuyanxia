angular.module('auth.service', ['ngResource'])

.factory('Loading', ['$ionicLoading', function($ionicLoading){
	function show(str) {
		$ionicLoading.show({
	     	template: str || 'Loading...'
	    });
	}
	function hide() {
		$ionicLoading.hide();
	}

	return {
		show: show,
		hide: hide
	};
}])

.factory('AjaxService', ['$http', function($http){
	var base_url = 'http://223.252.223.13/Roommates/api/';
	return  {
		login: function(data) {
			return $http.post(base_url + 'login', data);
		},
		register: function(data) {
			return $http.post(base_url + 'register', data);
		},
		checkEmail: function(data) {
			return $http.get(base_url + 'register/check', data);
		}
	}
}])

.factory('InfoPopupService', ['$ionicPopup', '$timeout', function($ionicPopup, $timeout){
	return  function(data, callback) {
		var title, template;
		if ( typeof data === "object" && data && (data.title || data.template)) {
			title = data.title;
			template = data.template;
		} else if(typeof data === "string" && data !== "") {
			template = data;
		} else {
			return;
		}
		console.log(data);
        var myPopup = $ionicPopup.show({
            title: title || "",
            template: template || ""
        });
        $timeout(function() {
            myPopup.close();
            if (typeof callback === 'function') callback();
        }, 1500);
    };
}])

.factory('Validate', function() {
	var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;

	var checkData = function(data, hasNickName) {
		var data = data || {},
			hasNickName = hasNickName || false;
		// 邮箱
		console.log(data);
		if (!data.email) {
			return {
				name: "email",
				text: "请输入企业邮箱"
			};
		} else if (!emailReg.test(data.email)) {
			return {
				name: "email",
				text: "邮箱格式错误"
			};
		}
		// 昵称
		if (hasNickName !== false) {
			if (!data.nickname) {
				return {
				name: "nickname",
				text: "请输入昵称"
			};
			} else if (data.nickname.length > 20) {
				return {
				name: "nickname",
				text: "昵称请小于20个字符"
			};
			} 
		}
		// 密码
		if (!data.password) {
			return {
				name: "password",
				text: "请输入登录密码"
			};
		} else if (data.password.length < 6) {
			return {
				name: "password",
				text: "为确保账户安全，密码请至少设置6位"
			};
		}
		return {};
	};

	return function($scope, data, hasNickName) {
		
		$scope.errorData = checkData(data, hasNickName);

		if ($scope.errorData.text) {
            if ($scope.errorData.name == "email") {
                $scope.errorEmail =  true;
                return true;
            } else if (hasNickName && $scope.errorData.name == "nickname") {
                $scope.errorNickName =  true;
                return true;
            } else if ($scope.errorData.name == "password") {
                $scope.errorPwd =  true;
                return true;
            }
        } 
        return false;
	};
});