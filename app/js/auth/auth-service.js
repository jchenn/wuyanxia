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

.factory('AjaxService', ['$resource', function($resource){
	function login() {
		var url = 'http://223.252.223.13/Roommates/api/login';
		return $resource(url);
	}
	function register() {
		var url = 'http://223.252.223.13/Roommates/api/register';
		return $resource(url);
	}
	function checkEmail() {
		var url = 'http://223.252.223.13/Roommates/api/register/check';
		return $resource(url);
	}

	return {
		login: login,
		register: register,
		checkEmail: checkEmail
	};
}])

.factory('InfoPopupService', ['$ionicPopup', '$timeout', function($ionicPopup, $timeout){
	return  function(data, callback) {
		var title, subTitle;
		if (typeof data === "object" && (data.title || data.subTitle)) {
			title = data.title;
			subTitle = data.subTitle;
		} else if(typeof data === "string" && data !== "") {
			title = data;
		} else {
			return;
		}
		console.log(data);
        var myPopup = $ionicPopup.show({
            title: title || "",
            subTitle: subTitle || ""
        });
        $timeout(function() {
            myPopup.close();
            if (typeof callback === 'function') callback();
        }, 1500);
    };
}])

.factory('Validate', function() {
	var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;

	return function(data, hasNickName) {
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
			} else if (data.nickname.length > 8) {
				return {
				name: "nickname",
				text: "昵称请小于8个字符"
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
});