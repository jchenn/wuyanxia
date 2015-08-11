angular.module('house.ctrl',[])
.controller('newCtrl',function($scope,$ionicSlideBoxDelegate,$timeout,Form,Cmn,Camera,$ionicLoading,house,Data,PersonalInfoMange,PersonalInfo,$ionicScrollDelegate,event,$ionicPopup){
    event.off("house.data.update").off("house.init").off("house.file.update");
    
    $scope.$on('$destroy',function(){
        event.off("house.data.update").off("house.init").off("house.file.update");
        Data.clear();
    });
    
    event.on('house.file.update',function(){
        var arr=Data.getFiles();
        var size=[];
        var len=arr.length;
        var num=0;
        if(len==0){
            step();
            return;
        }
        function step(){
            num++;
            if(num>=len){
                $timeout(function(){
                    $scope.pics=arr;
                    $scope.picSize=size;
                });
            }
        }
        for(var i=0;i<len;i++){
            var img=new Image();
            size[i]=0;
            img.src=arr[i];
            img.onload=(function(i){
                return function(){
                var index=i;
                if(this.width<this.height) size[index]=1;
                step();
                
            };
            })(i);
            img.onerror=function(){
                step();
            };
        }
        
        
    });
    
    event.on('house.data.update',function(){
        $timeout(function(){
            house.refreshForm1($scope);
        });
        
    });
    
    event.on('house.init',function(){
       
        
        $timeout(function(){
            init();
        });
    });
    /**控制器中用到的函数**/
    
    /*******************/
    
    /**模板中用到的变量、函数**/
    
    //向服务器添加数据
    function insert(){
        house.getFormData($scope);
        if(!house.checkWarnForm()) return;
        $ionicLoading.show({
            template:'提交中……'
        });
        Form.add(function(data){
            $ionicLoading.hide();
            if(data.errno==1){
                warn("你应该已经有房源了，来编辑吧！");
                PersonalInfoMange.update({hasHouse:1});
                event.trigger("house.init");
                return;
            }
            if(data.errno==0){
                Data.clearFormData();
                PersonalInfoMange.update({hasHouse:1});
                location.href="#/menu/people-list";
            }
        },function(){
            $ionicLoading.hide();
            warn("可能是图片太大了，上传失败~~");
        });
    }
    
    //向服务器更新数据
    function update(){
        //提交表单
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
        
        //提交图片（有房）
        var files=Data.getFiles();
        var toUpload=[];
        var indexs=[];
        for(var i=0;i<files.length;i++){
            if(/data:image\/jpeg;base64,/.test(files[i])){
                toUpload.push(files[i]);
                indexs.push(i);
            }
        }
        Form.addPics(toUpload,function(data){
            if(data.errno==1){
                warn(data.message);
            }
            else if(data.errno==0){
                var urls=data.url;
                try{
                    Data.replacePic(indexs,urls);
                }
                catch(e){
                    warn('出错了，都是我的错~~~');
                }
                
            }
        },function(){
            warn("可能图片太大了，上传失败了~~");
        });
        
    }
    
    
    function showPop(){
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
                            Data.clearPics();
                            Data.clearFormData();
                            location.href="#/menu/people-list";
                        }
                    });
                }
            });
    }
    
    
    function init(){
        
        Data.clear();
        
        house.resetForm1($scope);
    
        $scope.pics=[];
        
        $scope.picSize=[];
        //无房
        if(PersonalInfo.hasHouse==0){
            $scope.title="发布房源";
            $scope.send=insert;
            $scope.showPop=null;
            
        }
        //有房
        else if(PersonalInfo.hasHouse==1){
            $scope.title="编辑房源";
            $scope.send=update;
            Form.getData(PersonalInfo.userId,function(data){
                if(data.errno==0){
                    data=data.data;
                    Data.formDataIn(data);
                    Data.setFiles(data.picList);
                }
                else if(data.errno==1){
                    warn(data.message);
                    PersonalInfoMange.update({hasHouse:0});
                    event.trigger("house.init");
                }
            });
            //弹出框
            $scope.showPop=showPop;
        }
    
    }
    
    //设置返回函数
    $scope.back=Cmn.back;
    
    /**********************/
    
    /**执行部分**/
    event.trigger("house.init");
    //缓存弹窗函数，方便调用
    var warn=Cmn.warn;
    
    
    
    $scope.onAddClick=function(){
        Cmn.optionShow();
    };
    

    $scope.toView=function(index){
        location.href="#/menu/pic-view/"+index;
    };
    
    //跳转到描述
    $scope.toDesc=function(){
        house.getFormData($scope);
        location.href="#/menu/house-decoration";
    };
    
    $scope.getStyle=function(index){
        if($scope.picSize[index]==1)
            return "width:100%;height:auto;";
        else 
            return "";
    };
    /**********/

   
    
    

    
})

.controller('descCtrl',function($scope,Cmn,house){
    
    /**模板用到的变量、函数**/
    $scope.title="描述";
    $scope.back=Cmn.back;
    $scope.descComplete=function(){
        house.getFormData($scope);
        location.href="#/menu/house-new";
    };
    /********************/
    
    /**执行部分**/
    house.refreshForm2($scope);
    /**********/
})

.controller('picviewCtrl',function($scope,$stateParams,Data,Cmn,Form){
    var id=$stateParams.id;
    function deletePic(){
        var pic=Data.deleteFile(id);
        //todo 判断是否需要调用服务器删除接口
        if(!/data:image\/jpeg;base64,/.test(pic)){
            var imgId=pic.slice(pic.lastIndexOf('/')+1);
            Form.deletePics([imgId],function(data){
                $scope.back();
            })
            
        }else{
            $scope.back();
        }
        
    }
    $scope.src=Data.getFile(id);
    $scope.onDelete=deletePic;
    $scope.back=Cmn.back;
})
;