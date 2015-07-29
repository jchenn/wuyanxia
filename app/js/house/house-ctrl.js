angular.module('house.ctrl',[])
.factory('$back',function(){
    return function(){
        history.go(-1);
    };
})
.controller('newCtrl',function($scope,$back,$ionicActionSheet,$ionicSlideBoxDelegate,$timeout,Form,Pop,Data,File,$http,Check){
    
    $scope.test=function(){
        $http.get("http://223.252.223.13/Roommates/api/userhouse/2");
    };
    
    Pop.init({
        sure:function(){
            //alert('sure');
        },
        cancel:function(){
            //alert('cancel');
        }
    });
    
    
    //表单数据
    $scope.data={
    };
    
    $scope.btnText="完成";
    
    $scope.btnStatus="";
    
    $scope.title="发布房源";
    
    
    $scope.back=$back;
    
    //slide数据
    $scope.pics=[];
    
    //弹出框
    $scope.showPop=function(){
        Pop.show();
    };
    
    //显示选项
    $scope.optionShow=function(){
        $ionicActionSheet.show({
             buttons: [
               { text: '拍照' },
               { text: '从相册中选取' }
             ],
             cancelText: '取消',
             cancel: function() {
                  
                },
             buttonClicked: function(index) {
                 if(index==0){
                     addPic(1);
                 }
                 else if(index==1){
                     addPic(2);
                 }
               return true;
             }
        });
    };
    
    //点击完成是执行
    $scope.send=function(){
        
        Data.fill($scope.data);
        Form.add();
        Form.fileUpload();
    };
    

    
    //跳转到描述
    $scope.toDesc=function(){
        for(var i in $scope.data){
            Data.set(i,$scope.data[i]);
        }
        location.href="#/house-decoration";
    };
    
    var file=File.getFile(function(){
        var f=this.files[0];    
            Data.addFile(f);
            $scope.pics.push({
                src: window.URL.createObjectURL(f),
                alt: f.name
            });
            $timeout(function(){
                $ionicSlideBoxDelegate.update();
                //$timeout(function(){$ionicSlideBoxDelegate.slide();},100);
            },500);
    });
    
    function addPic(type){
        //camera
        if(type==1){
            file.capture="camera";
            file.click();
        }
        else if(type==2){
            file.capture="";
            file.click();
        }
        
    }
    
})
.controller('infoCtrl',function($scope,Form){
    Form.getData(1,function(data){
        $scope.pics=data.pics;
        $scope.data=data;
    });
})
.controller('descCtrl',function($scope,Data,$back,$location){
    $scope.data={};
    $scope.title="描述";
    $scope.back=$back;
     //输入描述完成
    $scope.descComplete=function(){
        Data.set('description',$scope.data.description);
        $location.path('/house-new');
    };
})
;