angular.module('house.ctrl',[])
.factory('$back',function($ionicHistory){
    return function(){
        $ionicHistory.goBack();
    };
})
.controller('newCtrl',function($scope,$back,$ionicActionSheet,$ionicSlideBoxDelegate,$timeout,Form,Pop,Data,File,$http,Check,Cmn,PersonalInfo,$location,PersonalInfoMange,Camera,$ionicLoading,myHttp){
    
    
    $scope.disable="disable";
    
    
    
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
            warn('标题长度错误！');
            return;
        }
        if(!Check.checkPrice($scope.data.price)){
            warn('价格格式错误');
            return ;
        }
        if(!Check.checkLen($scope.data.community,30,1)){
            warn('小区长度错误');
            return;
        }
        if(!Check.checkLen($scope.data.area,100,1)){
            warn('区域长度错误');
            return;
        }
        if(!Data.get('description')){
            warn('描述信息未填写');
            return;
        }
        $ionicLoading.show({
            template:'提交中~'
        });
        Data.fill($scope.data);
        Form.add(function(data){

            $ionicLoading.hide();
            if(data.errno==1){
                
                warn("你应该已经有房源了，来编辑吧！");
                location.href="#/house-update";
                return;
            }
            if(data.errno==0){
                
                location.href="#/menu/people-list";
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
        
            var opts={
                width:400,
                height:300,
                method:1,
                quality:50
            };
            if(type==2) opts.method=0;
            
            var onSuccess=function(data){
                var url="data:image/jpeg;base64," + data;
                $scope.pics.push(url);
                Data.addFile(url);
                $timeout(function(){
                    $ionicSlideBoxDelegate.update();
                    $timeout(function(){$ionicSlideBoxDelegate.next();},100);
            },500);
            };
            var onFail=function(d){alert(d);};
           Camera.getPic(onSuccess,onFail,opts,1);
        
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
.controller('updateCtrl',function($scope,houseInfo,$ionicSlideBoxDelegate,Data,Check,Cmn,Form,$ionicLoading,$back,Pop){
    var warn=Cmn.warn;
    $scope.back=$back;
     //表单数据
    $scope.data={
        title:'',
        price:'',
        area:'',
        community:''
    };
   Pop.init({
        sure:function(){
            Form.delete(function(data){
                if(data.errno==1){
                    warn(data.message);
                    return;
                }
                else if(data.errno==0){
                    PersonalInfoMange.update({
                        "hasHouse":0
                    });
                    location.href="#/menu/people-list";
                }
            });
        },
        cancel:function(){
            //alert('cancel');
        }
    });
    houseInfo.update(function(data){
            if(typeof data == 'string'){
                Cmn.warn(data);
                location.href="#/house-new";
                return;
            }
            Data.fill(data);
            $scope.data=data;
            $scope.pics=data.picList;
            $ionicSlideBoxDelegate.update();
    });
    
    $scope.btnText="完成";
    $scope.title="房源编辑";
    //撤销房源按钮是否可以点击（可点击）
    $scope.destroy="";
    //弹出框
    $scope.showPop=function(){
        //return;
        Pop.show();
    };
     //显示选项
   /* $scope.optionShow=function(){
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
    };*/
    
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
        $ionicLoading.show({
            template:'提交中~'
        });
        Form.update(function(data){
            $ionicLoading.hide();
            if(data.errno==1){
                warn(data.message);
                
                return;
            }
            if(data.errno==0){
                location.href="#/menu/people-list";
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
        description:Data.get('description')
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