angular.module('house.ctrl',[])
.factory('$back',function(){
    return function(){
        history.go(-1);
    };
})
.controller('newCtrl',function($scope,$back,$ionicActionSheet,$ionicSlideBoxDelegate,$timeout,Form,Pop,Data,File,$http,Check,Cmn,PersonalInfo,$location,PersonalInfoMange,Camera){
    
    $scope.test=function(){
        $http.get("http://223.252.223.13/Roommates/api/userhouse/2");
    };
    
    //撤销房源按钮是否可以点击
    $scope.destroy="disabled";
    
    Pop.init({
        sure:function(){
            Form.delete(function(data){
                if(data.errno==1){
                }
                else if(data.errno==0){
                    PersonalInfoMange.update({
                        "hasHouse":0
                    });
                }
            });
        },
        cancel:function(){
            //alert('cancel');
        }
    });
    
    var warn=Cmn.warn;
    
    //表单数据
    $scope.data={
        title:'',
        price:'',
        area:'',
        community:''
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
        if(!Check.checkLen($scope.data.title,30,1)){
            warn('标题输入错误！');
            return;
        }
        if(!Check.checkPrice($scope.data.price)){
            warn('价格输入错误');
            return ;
        }
        if(!Check.checkLen($scope.data.community,30,1)){
            warn('小区输入错误');
            return;
        }
        if(!Check.checkLen($scope.data.area,100,1)){
            warn('地址输入错误');
            return;
        }
        if(!Data.get('description')){
            warn('描述信息未填写');
            return;
        }
        Data.fill($scope.data);
        $scope.btnText="提交中~";
        $scope.btnStatus="disabled";
        Form.add(function(data){
            $scope.btnText="完成";
            $scope.btnStatus="";
            if(data.errno==1){
                warn(data.message);
                return;
            }
            if(data.errno==0){
                location.href="#/me/q/1"
            }
        });
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
.controller('infoCtrl',function($scope,Form,$ionicSlideBoxDelegate,$timeout,Cmn,houseInfo){
    Form.getData(1,function(data){
        if(data.errno==1){
            Cmn.warn(data.message);
        }
        $scope.pics=data.data.picList;
        $scope.data=data.data;
        $ionicSlideBoxDelegate.update();
    });

})
.controller('descCtrl',function($scope,Data,$back,$location,Check,Cmn){
    $scope.data={
        description:''
    };
    $scope.title="描述";
    $scope.back=$back;
     //输入描述完成
    $scope.descComplete=function(){
        if(!Check.checkLen($scope.data.description,100,1)){
            Cmn.warn('描述信息错误');
            return;
        }
        Data.set('description',$scope.data.description);
        $location.path('/house-new');
    };
})
.controller('updateCtrl',function($scope,houseInfo,$ionicSlideBoxDelegate,Data,Check,Cmn,Form){
    var warn=Cmn.warn;
        houseInfo.update(function(data){
            if(typeof data == 'string'){
                Cmn.warn(data);
                return;
            }
            Data.fill(data);
            $scope.data=data;
            $scope.pics=data.picList;
            $ionicSlideBoxDelegate.update();
        });
    
        $scope.btnText="完成";
    
    //撤销房源按钮是否可以点击（可点击）
    $scope.destroy="";
    
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
        if(!Check.checkLen($scope.data.title,30,1)){
            warn('标题输入错误！');
            return;
        }
        if(!Check.checkPrice($scope.data.price)){
            warn('价格输入错误');
            return ;
        }
        if(!Check.checkLen($scope.data.community,30,1)){
            warn('小区输入错误');
            return;
        }
        if(!Check.checkLen($scope.data.area,100,1)){
            warn('地址输入错误');
            return;
        }
        if(!Data.get('description')){
            warn('描述信息未填写');
            return;
        }
        Data.fill($scope.data);
        Form.update(function(data){
            if(data.errno==1){
                warn(data.message);
                return;
            }
            if(data.errno==0){
                location.href="#/me";
            }
        });
    };
    

    
    //跳转到描述
    $scope.toDesc=function(){
        for(var i in $scope.data){
            Data.set(i,$scope.data[i]);
        }
        location.href="#/house-desc-update";
    };
})
.controller('descupdateCtrl',function($scope,Check,Data,$location,$back){
    $scope.data={
        description:''
    };
    $scope.title="描述";
    $scope.back=$back;
     //输入描述完成
    $scope.descComplete=function(){
        if(!Check.checkLen($scope.data.description,100,1)){
            Cmn.warn('描述信息错误');
            return;
        }
        Data.set('description',$scope.data.description);
        $location.path('/house-update');
    };
})
;