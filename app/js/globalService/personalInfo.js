ServiceModule
.value('PersonalInfo', {})

.factory('PersonalInfoMange', ['PersonalInfo', function(PersonalInfo){

    function update(obj) {
        if (typeof obj === "object") {
            angular.extend(PersonalInfo, obj);
            localStorage.setItem('PersonalInfo', JSON.stringify(PersonalInfo));
        }         
    };
    function remove(item) {
        if (typeof item === "string") {
            delete PersonalInfo.item;
        } 
        localStorage.setItem('PersonalInfo', JSON.stringify(PersonalInfo));
    };
    function clear() {
        for( var i in PersonalInfo) {
            PersonalInfo[i]= "";
        }
        localStorage.removeItem('PersonalInfo');
    };
    function get(item) {
        if (item in PersonalInfo) {
            return PersonalInfo[item];
        } 
    };

    return {
        update: update,
        remove: remove,
        get: get,
        clear: clear
    };
}]);
