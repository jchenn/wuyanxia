angular.module('wuww.ctrl',[])
.factory('$back',function(){
    return function(){
        history.go(-1);
    };
})
.controller('newCtrl',function($scope,$back,$ionicActionSheet,$ionicSlideBoxDelegate){
    
    $scope.title="发布房源";
    
    $scope.back=$back;
    
    $scope.optionShow=function(){
        $ionicActionSheet.show({
             buttons: [
               { text: '拍照' },
               { text: '从相册中选取' }
             ],
             cancelText: '取消',
             cancel: function() {
                  // add cancel code..
                },
             buttonClicked: function(index) {
               return true;
             }
        });
    };
    
    $scope.next=function(){
        alert('sdf');
    };
})
.controller('descCtrl',function($scope,$back){
    $scope.title="描述";
    $scope.back=$back;
})
;