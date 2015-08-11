angular.module('auth.filters', [])

.filter('AEFliter', function() {
	return function(arr, inputStr) {
		inputStr = inputStr || '';
		var emailArr = [];
		var obj = inputStr.match(/^(\w+([-+.]\w+)*@)(.*)$/);
		var suffix, prefix, email;
		if (obj) {
			prefix = obj[1];
			suffix = obj[3];
		}
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].indexOf(suffix) !== -1) {
				email = prefix +arr[i];
				emailArr.push(email);
			}
		}
		return emailArr;
	};
});
