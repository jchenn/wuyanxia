angular.module('house.ctrl',[])
.factory('$back',function(){
    return function(){
        history.go(-1);
    };
})
.factory('Form',function($http){
    var f=new FormData();
    return {
        append:function(key,value){
            f.append(key,value);
        },
        send:function(){
        }
    };
})
.controller('newCtrl',function($scope,$back,$ionicActionSheet,$ionicSlideBoxDelegate,$timeout,Form){
     fileList=[];
    
    $scope.title="发布房源";
    
    $scope.back=$back;
    
    $scope.pics=[];
    
    $scope.optionShow=function(){
        $ionicActionSheet.show({
             buttons: [
               { text: '拍照' },
               { text: '从相册中选取' }
             ],
             cancelText: '取消',
             cancel: function() {
                  ;;
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
    function createFile(){
        var file=document.createElement('input');
        file.type="file";
        file.accept="image/*";
        file.hidden="hidden";
        file.addEventListener('change',function(){
            var f=this.files[0];
            
            
                fileList.push(f);
                $scope.pics.push({
                    src: window.URL.createObjectURL(f),
                    alt: f.name
                });
                $timeout(function(){
                $ionicSlideBoxDelegate.update();
                
                $timeout(function(){$ionicSlideBoxDelegate.next();},100);
            },500);
            
            
            
        });
        document.body.appendChild(file);
        return file;
    }
    
    var file=createFile();
    
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
.controller('descCtrl',function($scope,$back){
    $scope.title="描述";
    $scope.back=$back;
})
.controller('infoCtrl',function(){})
;