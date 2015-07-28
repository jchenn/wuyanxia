/**
 * Created by hzliaobolin on 2015/7/28.
 */
angular.module('me.service',[])
.factory('PersonalInfo',function(){
        return {
            'lookStatus' : '正在寻找',
            'birth': '1988-10-22',
            'name': '',
            'sex': '',
            'company': '',
            'job': '',
            'phone': '',
            'title': '',
            'key': '',
            'val': ''
        };
    });