ServiceModule
.factory('PersonalInfo',function(){
        //title,key,val 作为修改信息参数
        //lookStatus 0表示正在寻找，1表示已经找到
    return {
        'lookStatus' : 0,
        'birth': '1988-10-22',
        'name': '',
        'sex': '',
        'company': '',
        'job': '',
        'phone': '',
        //个人信息交互使用
        'year': '1988',
        'month': '10',
        'day': '22',
        'title': '',
        'key': '',
        'val': '',

        //显示使用
        //completeInfo 是否完成个人资料 0 表示No 1表示 Yes
        //completeAsk 是否完成问卷  0 表示No 1表示 Yes
        //信用额度 0 1 2
        //headUrl 头像链接

        'completeInfo': 0,
        'completeAsk': 0,
        'credit': 0,
        'headUrl': 'http://223.252.223.13/Roommates/photo/photo_123.jpg'
    };
});