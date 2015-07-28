angular.module('auth.service', ['ngResource'])

.factory('LoginService', function($resource){
	return $resource('/login');
})

.factory('RegisterService', function($resource){
	return $resource('/register');
})

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
			if (!data.nickName) {
				return {
				name: "nickName",
				text: "昵称不能为空"
			};
			} else if (data.nickName.length > 8) {
				return {
				name: "nickName",
				text: "昵称请小于8个字符"
			};
			} 
		}
		// 密码
		if (!data.pwd) {
			return {
				name: "pwd",
				text: "密码不能为空"
			};
		} else if (data.pwd.length < 6 || data.pwd.length > 20) {
			return {
				name: "pwd",
				text: "密码不能少于6个或者大于20个"
			};
		}
		
		return {};
	}
})