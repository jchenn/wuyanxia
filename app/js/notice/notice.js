angular.module('notice',['ionic'])
    .controller('c1',function($scope,$http){
    $scope.imgSrc="a.jpg";
    $scope.notices=[
        {
            active:1,
            id:1,
            type:0,
            title:"我是标题",
            content:"我是内容",
            time:"13:14 PM"
        },
        {
            active:0,
            id:1,
            type:1,
            title:"我是标题",
            content:"我是内容",
            time:"13:14 PM"
        }
    ];
    $scope.locate=function(type){
        //0 邀请回复
        if(type==0){
            window.location="/#/notice/reply";
        }
        //1 聊天
        else if(type==1){
            window.location="/#/notice/chart";
        }
    };
    $scope.delete=function(id){
        alert(id);
    };
})
.controller('chartCtrl',function($scope){
    $scope.title="木鱼";
})
.controller('replyCtrl',function($scope){
    $scope.title="邀请回复";
})
;