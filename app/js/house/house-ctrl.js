angular.module('house.ctrl',[])
.controller('newCtrl',function($scope,$ionicActionSheet,$ionicSlideBoxDelegate,$timeout,Form,Cmn,Camera,$ionicLoading,house,Data,PersonalInfoMange,$ionicScrollDelegate){
    
    /**控制器中用到的函数**/
    
    //刷新图片轮播插件
    function refreshSlidebox(){
            try{
                $timeout(function(){
                $ionicSlideBoxDelegate.update();
                    $timeout(function(){
                        $ionicSlideBoxDelegate.next();
                    },100);
            },500);
        }
        catch(e){
            
            alert(e);
        }
        
    }
    
    //图片轮播滚动到最后一页
    function lastSlidebox(){
        //todo
    }
    
    //显示选项菜单
    function optionShow(){
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
    }
    
    function toPicEdit(){
        location.href="#/pic-edit";
    }
    /**
     *照相
     *@param type 1 照相  2 从相册选
     *
     */
    function addPic(type){
            var opts={
                width:400,
                height:300,
                method:1,
                quality:70
            };
            if(type==2){ opts.method=0;opts.width=300;opts.height=400;}
            
            var onSuccess=function(data){
                try{
                    var url="data:image/jpeg;base64," + data;
                    $scope.pics.push(url);
                    Data.addFile(url);
                    refreshSlidebox();
                }catch(e){
                    alert(e);
                }
               
            };
            var onFail=function(d){alert(d);};
           Camera.getPic(onSuccess,onFail,opts,1);
        
    }
    
    /*******************/
    
    /**模板中用到的变量、函数**/
    
    //设置页面标题
    $scope.title="发布房源";
    
    
    //设置返回函数
    $scope.back=Cmn.back;
    
    $scope.onSlideboxClick=toPicEdit;
    /**********************/
    
    /**执行部分**/
    
    //缓存弹窗函数，方便调用
    var warn=Cmn.warn;
    
    
    $scope.data=Data.formDataOut();
    
    //清空图片列表
    $scope.pics=Data.getFiles();
    
    
     //点击完成是执行
    $scope.send=function(){
        house.getFormData($scope);
        if(!house.checkWarnForm()) return;
        $ionicLoading.show({
            template:'提交中……'
        });
        Form.add(function(data){

            $ionicLoading.hide();
            if(data.errno==1){
                
                warn("你应该已经有房源了，来编辑吧！");
                location.href="#/house-update";
                return;
            }
            if(data.errno==0){
                house.resetForm1($scope);
                Data.clearFormData();
                PersonalInfoMange.update({hasHouse:1});
                location.href="#/menu/people-list";
            }
        });
    };
    
    $scope.onFocus=function(){
        $timeout(function(){
            $ionicScrollDelegate.scrollBottom();
        },500);
        
    };

    
    //跳转到描述
    $scope.toDesc=function(){
        house.getFormData($scope);
        location.href="#/house-decoration";
    };
    
    
    /**********/

   
    
    

    
})

.controller('descCtrl',function($scope,Cmn,house){
    
    /**模板用到的变量、函数**/
    $scope.title="描述";
    $scope.back=Cmn.back;
    $scope.descComplete=function(){
        house.getFormData($scope);
        location.href="#/house-new";
    };
    /********************/
    
    /**执行部分**/
    house.resetForm2($scope);
    /**********/
})
.controller('updateCtrl',function($scope,houseInfo,$ionicSlideBoxDelegate,Data,Check,Cmn,Form,$ionicLoading,Pop,house,$ionicScrollDelegate,PersonalInfoMange,$timeout){
    
    function toPicEdit(){
        location.href="#/pic-edit";
    }
    
    var warn=Cmn.warn;
    
    $scope.back=Cmn.back;
    
    $scope.title="房源编辑";
    
    $scope.onFocus=function(){
        $timeout(function(){
            $ionicScrollDelegate.scrollBottom();
            //console.log('focus');
        },500);
        
    };
   
    //弹出框
    $scope.showPop=function(){
        Pop.show();
    };
    
    Pop.init({
        sure:function(){
            Form.delete(function(data){
                console.log(data);
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
    
    house.resetForm1($scope);
    
    
    houseInfo.update(function(data){
            if(typeof data == 'string'){
                Cmn.warn(data);
                location.href="#/house-new";
                return;
            }
            Data.formDataIn(data);
            $scope.data=data;
            $scope.pics=data.picList;
            $ionicSlideBoxDelegate.update();
    });
  
  
    //点击完成是执行
    $scope.send=function(){
        house.getFormData($scope);
        if(!house.checkWarnForm()){
            return;
        }
        $ionicLoading.show({
            template:'提交中……'
        });
        Form.update(function(data){
            $ionicLoading.hide();
            if(data.errno==1){
                warn(data.message);
                
                return;
            }
            if(data.errno==0){
                Data.clearFormData();
                location.href="#/menu/people-list";
            }
        });
    };
    
    $scope.onSlideboxClick=toPicEdit;

    
    //跳转到描述
    $scope.toDesc=function(){
        house.getFormData($scope);
        location.href="#/house-desc-update";
    };
})
.controller('descupdateCtrl',function($scope,Check,Data,$location,Cmn){
    $scope.data={
        description:Data.get('description')
    };
    $scope.title="描述";
    $scope.back=Cmn.back;
     //输入描述完成
    $scope.descComplete=function(){
        Data.set('description',$scope.data.description);
        $location.path('/house-update');
    };
})
.controller('piceditCtrl',function($scope,Camera,house,$ionicActionSheet,Cmn,Data){
    
    //拍照
    function addPic(type){
        var opts={
                method:1,
                quality:70
            };
            if(type==2){ opts.method=0;}
            
            var onSuccess=function(data){
                
                var url="data:image/jpeg;base64," + data;
                $scope.pics.push(url);
                console.log($scope.pics);
                Data.addFile(url);
                
               
            };
            var onFail=function(d){alert(d);};
           Camera.getPic(onSuccess,onFail,opts,1);
    }
    
    //显示菜单
    function optionShow(){
        $ionicActionSheet.show({
             buttons: [
               { text: '拍照' },
               { text: '从相册中选取' }
             ],
             cancelText: '取消',
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
    }
    
    function deleteImage(index){
        house.deletePic(index);
        house.picsOut($scope);
    }

    $scope.title="房源图片";
    
    $scope.onAddClick=optionShow;
    
    $scope.onDeleteClick=deleteImage;
    
    $scope.back=Cmn.back;
    
    $scope.pics=Data.getFiles();
    
    $scope.onSureClick=function(){
        $scope.pics.push('a.'+Math.random());
    };
})
;