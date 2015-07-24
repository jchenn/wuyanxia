angular.module('notice',[])
    .config(function($stateProvider){
    $stateProvider
     //邀请回复界面 
        .state('noticereply',{
            url:'/notice/reply',
            templateUrl:"templates/notice/reply.html",
            controller:'replyCtrl'
        })
    //聊天界面
        .state('noticechart',{
            url:'/notice/chart',
            templateUrl:"templates/notice/chart.html",
            controller:'chartCtrl'
        })
    //
        .state('user',{
            url:'/user/:id',
            templateUrl:"templates/user/info.html"
        })
        ;
    })
   
    .controller('c1',function($scope,$http, $location){
    $scope.imgSrc="a.jpg";
    $scope.notices=[
        {
            active:1,
            id:1,
            type:0,
            title:"邀请回复",
            content:"木鱼拒绝了您的合租请求",
            time:"13:14 PM"
        },
        {
            active:0,
            id:1,
            type:1,
            title:"室友私信",
            content:"木鱼说很高兴认识你",
            time:"13:14 PM"
        }
    ];
    $scope.locate=function(type){
        //0 邀请回复
        if(type==0){
           return "#/notice/reply";
        }
        //1 聊天
        else if(type==1){
            return "#/notice/chart";
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