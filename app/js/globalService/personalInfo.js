ServiceModule
.value('PersonalInfo',{
        'lookStatus' : 0,
        'birth': '1985-1-1',
        'name': '',
        'sex': '',
        'company': '',
        'job': '',
        'phone': '',
        //个人信息交互使用
        'title': '',
        'key': '',
        'val': '',

        //completeInfo 是否完成个人资料 0 表示No 1表示 Yes
        //completeAsk 是否完成问卷  0 表示No 1表示 Yes

        //信用额度 0 1 2
        //headUrl 头像链接
        //hasHouse 是否有房
        //userId 用户ID

        'completeInfo': 0,
        'completeAsk': 0,
        'credit': '一般信用',
        'headUrl': 'http://223.252.223.13/Roommates/photo/photo_123.jpg',
        'userId': '1',
        'hasHouse': 0
})

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
        if (typeof item === "string") {
            return PersonalInfo.item;
        } 
    };

    return {
        update: update,
        remove: remove,
        get: get,
        clear: clear
    };
}]);
