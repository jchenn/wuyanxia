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
        },
        get:function(){
            return f;
        }
    };
})
.controller('newCtrl',function($scope,$back,$ionicActionSheet,$ionicSlideBoxDelegate,$timeout,Form,$http,Pop){
    
    Pop.init({
        sure:function(){
            alert('sure');
        },
        cancel:function(){
            alert('cancel');
        }
    });
    
    //记录添加的文件
     var fileList=[];
    
    //表单数据
    $scope.data={};
    
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
    
    //创建input file，并绑定事件，返回DOM input file
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
    
    //将数据存到FormData中
    function getData(){
        
    }
    //发送数据
    $scope.send=function(){
        Form.append('b','datab');
        $http.post('/error',Form.get());
    };
})
.controller('descCtrl',function($scope,$back,$http,Form){
    $scope.title="描述";
    $scope.back=$back;
    $scope.add=function(){
        Form.append('test','test');
        $http.post('/test',Form.get());
    };
})
.controller('infoCtrl',function($scope,Form){
    
})
.controller('testCtrl',function(){
})
;