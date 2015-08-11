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
			// return $http.post(base_url + 'login', data, {headers:{
   //                      'If-Modified-Since': '0'
   //                  }});
		},
		register: function(data) {
			return $http.post(base_url + 'register', data);
		},
		checkEmail: function(data) {
			return $http({
				method: 'GET',
				url: base_url + 'register/check',
				params: data
			});
			// return $http.get(base_url + 'register/check', data);
		}
	};
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
            template: template || "",
            cssClass: 'toast'
        });
        $timeout(function() {
            myPopup.close();
            if (typeof callback === 'function') callback();
        }, 1500);
    };
}]);