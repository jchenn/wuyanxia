angular.module('house.ctrl',[])
.controller('newCtrl',function($scope,$ionicSlideBoxDelegate,$timeout,Form,Cmn,Camera,$ionicLoading,house,Data,PersonalInfoMange,$ionicScrollDelegate){
    
    console.log('new');
    
    /**控制器中用到的函数**/
    
    //刷新图片轮播插件
    function refreshSlidebox(){
            
        $timeout(function(){
            $ionicSlideBoxDelegate.update();
                $timeout(function(){
                    $ionicSlideBoxDelegate.next();
                },100);
        },500);
        
    }
    
    //图片轮播滚动到最后一页
    function lastSlidebox(){
        //todo
    }
    
    
    function toPicEdit(){
        house.getFormData($scope);
        location.href="#/pic-edit";
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
    
    //初始化表单数据
    house.refreshForm1($scope);
    
    //初始化图片列表
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
    console.log('desc');
    /**模板用到的变量、函数**/
    $scope.title="描述";
    $scope.back=Cmn.back;
    $scope.descComplete=function(){
        house.getFormData($scope);
        location.href="#/house-new";
    };
    /********************/
    
    /**执行部分**/
    house.refreshForm2($scope);
    /**********/
})
.controller('updateCtrl',function($scope,houseInfo,$ionicSlideBoxDelegate,Data,Check,Cmn,Form,$ionicLoading,Pop,house,$ionicScrollDelegate,PersonalInfoMange,$timeout,$ionicPopup){
    console.log('update');
    function toPicEdit(){
        house.getFormData($scope);
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
        
        $ionicPopup.confirm(
          {
            template: '撤销房源后，将变为“我无房源，找室友合租”状态呦。',
            okText: '确定',
            cancelText: '取消'
          })
            .then(function(res){
                if(res){
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
                }
            });
    };
    
    /*Pop.init({
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
    });*/
    
    
    
    houseInfo.update(function(data){
        console.log('to update');
        if(typeof data == 'string'){
            Cmn.warn(data);
            location.href="#/house-new";
            return;
        }
        Data.formDataIn(data);
        var pics=data.picList;
        Data.clearPics();
        for(var i=0;i<pics.length;i++){
            Data.addFile(pics[i]);
        }
        house.refreshForm1($scope);
        //console.log(Data.getFiles());
        $scope.pics=Data.getFiles();
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
    console.log('descupdate');
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
.controller('piceditCtrl',function($scope,Camera,house,$ionicActionSheet,Cmn,Data,PersonalInfo){
    console.log('picedit');
    
    //拍照
    function addPic(type){
        var opts={
                method:1,
                quality:10
            };
            if(type==2){ opts.method=0;}
            
            var onSuccess=function(data){
                
                var url="data:image/jpeg;base64," + data;
                
                Data.addFile(url);
                
                
                $scope.$apply(function(){
                    $scope.pics=Data.getFiles();
                });

               
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
    
    function toEdit(){
        if(PersonalInfo.hasHouse==0){
            location.href="#/house-new";
        }
        else if(PersonalInfo.hasHouse==1){
            var tag=0;
            house.deletePics(function(){
                tag++;
                if(tag>=2) location.href="#/house-update";
            });
            house.uploadPics(function(){
                tag++;
                if(tag>=2) location.href="#/house-update";
            });
            
        }
    }
    
    function deleteImage(index){
        house.deletePic(index);
        $scope.pics=Data.getFiles();
    }

    $scope.title="房源图片";
    
    $scope.onAddClick=optionShow;
    
    $scope.onDeleteClick=deleteImage;
    
    $scope.back=Cmn.back;
    
    $scope.pics=Data.getFiles();
    
    $scope.onSureClick=toEdit;
})
;