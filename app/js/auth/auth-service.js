angular.module('auth.service', ['ngResource'])

.factory('LoginService', function($resource){
	// var url = 'http://223.252.223.13/api/login';
	// var url = '/api/login';
	var url = 'http://www.baidu.com';
	return $resource(url);
})

.factory('RegisterService', function($resource){
	var url = 'http://223.252.223.13/api/register';
	// var url = '/api/register';
	return $resource(url);
})

.factory('CheckService', function($resource){
	var url = 'http://223.252.223.13/api/register/check';
	// var url = '/api/register';
	return $resource(url);
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