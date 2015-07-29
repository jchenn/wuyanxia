angular.module('auth.service', ['ngResource'])

.factory('LoginService', function($resource){
	var url = 'http://223.252.223.13/Roommates/api/login';
	return $resource(url);
})

.factory('RegisterService', function($resource){
	var url = 'http://223.252.223.13/Roommates/api/register';
	// var url = '/api/register';
	return $resource(url);
})

.factory('CheckService', function($resource){
	var url = 'http://223.252.223.13/Roommates/api/register/check';
	// var url = '/api/register';
	return $resource(url);
})

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
    }
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
				text: "邮箱不能为空"
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
				text: "昵称不能为空"
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
				text: "密码不能为空"
			};
		} else if (data.password.length < 6 || data.password.length > 20) {
			return {
				name: "password",
				text: "密码不能少于6个或者大于20个"
			};
		}
		
		return {};
	}
})