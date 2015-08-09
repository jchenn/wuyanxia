angular.module('house.service',[])
.factory('myHttp',function(){
    function Http(method,url,data,callback){
        var xhr=new XMLHttpRequest();
        xhr.open(method,url);
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                callback(xhr.responseText);
            }
            //console.log(xhr.readyState);
        };
        xhr.send(data);
        //console.log('send');
    }
    return {
        http:Http
    };
})
.factory('Popup',function($timeout){
    
    var cover=document.createElement('div');
        
    cover.style.display="none";
    
    cover.classList.add('m-cover');
    
    cover.classList.add('house-view');
    
    cover.innerHTML=
    '<div class="m-cover">'+
        '<div class="m-pop">'+
            '<div class="m-pop-head">提示'+
            '</div>'+
            '<div class="m-pop-content f-wwa">'+
            '</div>'+
        '</div>'+
    '</div>';
    
    //是否初始化
    var isInited=false;
    var fn=function(){};
    return {
        
        
        init:function(){
            if(isInited) return;
            var self=this;
            var parent=document.body;
            parent.appendChild(cover);
            cover.addEventListener('click',function(event){
                self.hide();
                fn();
                console.log('click');
            });
            isInited=true;
        },
        show:function(str,callback,time){
            fn=function(){};
            if(callback) fn=callback;
            var self=this;
            if(!isInited) this.init();
            cover.querySelector('.m-pop-content').innerHTML=str;
            cover.style.display='block';
            if(time) 
                $timeout(function(){
                    self.hide();
                    fn();
                },time);
        },
        hide:function(){
            cover.style.display='none';
        },
        destroy:function(){
            cover.parentNode.removeChild(cover);
            isInited=false;
        }
    };
    
})
.factory('Pop',function(){
    
    var cover=document.createElement('div');
    
    cover.style.display="none";
    
    cover.classList.add('m-cover');
    
    cover.classList.add('house-view');
    
    cover.innerHTML=
    '<div class="m-cover">'+
        '<div class="m-pop">'+
            '<div class="m-pop-content f-wwa">'+
                '撤销房源后，将变为"我无房源，找室友合租"状态'+
            '</div>'+
            '<div class="m-pop-btns">'+
                '<button class="m-btn t-cancel">取消</button>'+
                '<button class="m-btn t-sure">确定</button>'+
            '</div>'+
        '</div>'+
    '</div>';
    
    //是否初始化
    var isInited=false;
    
    return {
        
        /**
         *@para {Object} options
         *      -sure {Function} 点击确定时执行
         *      -cancel {Function} 点击取消时执行
         */
        init:function(o){
            if(isInited) return;
            var self=this;
            var parent=document.body;
            parent.appendChild(cover);
            cover.addEventListener('click',function(event){
                var ele=event.target;
                if(ele.classList.contains('t-sure')){
                    self.hide();
                    if(o.sure){
                        o.sure.call(this,event);
                    }
                }
                else if(ele.classList.contains('t-cancel')){
                    self.hide();
                    if(o.cancel){
                        o.cancel.call(this,event);
                    }
                }
            });
            isInited=true;
        },
        show:function(){
            if(!isInited) this.init({});
            cover.style.display='block';
        },
        hide:function(){
            cover.style.display='none';
        },
        destroy:function(){
            cover.parentNode.removeChild(cover);
            isInited=false;
        }
    };
})
.factory('Form',function($http,Data,PersonalInfo,Check,myHttp){
    //var host="http://10.240.35.18:8080";    
    var host="http://223.252.223.13";
    var updatePath="/Roommates/api/userhouse/update";
    //var filePath="/Roommates/api/housePhoto/batchUpload";
    var addPath="/Roommates/api/userhouse/insert";
    var getPath="/Roommates/api/userhouse/";
    var deletePath="/Roommates/api/userhouse/delete/";
    var delpicPath="/Roommates/api/userhouse/deleteimage";
    var addpicPath="/Roommates/api/userhouse/addimage";
    
    
    return {
        
        
        update:function(callback){
            var data={
                userId:PersonalInfo.userId
            };
            var form=Data.getAll();
            console.log(form);
            for(var i in form) data[i]=form[i];
            $http.post(host+updatePath,data).success(callback);
        },
        
        
        add:function(callback,error){
            
            var data={
                userId:PersonalInfo.userId,
                files:Data.getFiles()
            };
            var form=Data.getAll();
            for(var i in form) data[i]=form[i];
            
            $http.post(host+addPath,data).success(callback).error(error);
        },
        
        
        getData:function(id,callback){
            $http.get(host+getPath+id).success(function(d){
                callback(d);
            });
        },
        
        
        delete:function(callback){
            var id=PersonalInfo.userId;
            $http.get(host+deletePath+id).success(callback);
        },
        
        
        deletePics:function(data,callback){
           var d={
               imgId:data,
               userId:PersonalInfo.userId
           }; $http.post(host+delpicPath,d).success(callback);
        },
        
        
        addPics:function(data,callback,error){
            var d={
                userId:PersonalInfo.userId,
                images:data
            };
            $http.post(host+addpicPath,d).success(callback).error(error);
        }
    };
})
.factory('Data',function(event){
    var data={
        title:'',
        price:'',
        community:'',
        area:'',
        description:''
    };
    var fileList=[];
    //var delList=[];
    return {
        get:function(key){
            return data[key];
        },
        getAll:function(){
            var res={};
            for(var i in data){
                res[i]=data[i];
            }
            return res;
        },
        addFile:function(file){
            fileList.push(file);
            event.trigger("house.data.update");
        },
        setFiles:function(arr){
            fileList=arr;
            event.trigger("house.data.update");
        },
        getFile:function(id){
            return fileList[id];
        },
        getFiles:function(){
            return fileList.slice(0);
        },
        deleteFile:function(index){
            var res= fileList.splice(index,1)[0];
            event.trigger("house.data.update");
            return res;
        },
        addDelete:function(pic){
            delList.push(pic);
        },
        getDeletes:function(){
            return delList.slice(0);
        },
        clearPics:function(){
            fileList=[];
            event.trigger("house.data.update");
        },
        replacePic:function(indexs,pics){
            if(indexs.length!==pics.length){
                return -1;
            }
            for(var i=0;i<indexs.length;i++){
                fileList.splice(indexs[i],1,pics[i]);
            }
            event.trigger("house.data.update");
        },
        clear:function(){
            this.clearPics();
            this.clearFormData();
        },
        formDataIn:function(form,tag){
            for(var i in form){
                if(typeof data[i]!="undefined") data[i]=form[i];
            }
            if(tag) return;
            event.trigger("house.data.update");
        },
        formDataOut:function(){
            return this.getAll();
        },
        clearFormData:function(){
            data={
                title:'',
                price:'',
                community:'',
                area:'',
                description:''
            };
            event.trigger("house.data.update");
        }
    };
})
.factory('File',function(){
    //创建input file，并绑定事件，返回DOM input file
    function createFile(callback){
        var file=document.createElement('input');
        file.type="file";
        file.accept="image/*";
        file.hidden="hidden";
        file.addEventListener('change',callback,false);
        document.body.appendChild(file);
        return file;
    }
    var file;
    var isInited=false;
    return {
        getFile:function(callback){
            if(isInited) return file;
            file=createFile(callback);
            isInited=true;
            return file;
        }
    };
})
.factory('Cmn',function(Popup,$ionicHistory,$ionicActionSheet,Camera,Data){
    
    return {
        warn:function(str,callback,time,unclick){
            return Popup.show(str,callback,time,unclick);
        },
        back:function(){
            //console.log('back');
            $ionicHistory.goBack();
        },
        optionShow:function(callback){
            var self=this;
            $ionicActionSheet.show({
                 buttons: [
                   { text: '拍照' },
                   { text: '从相册中选取' }
                 ],
                 cancelText: '取消',
                 buttonClicked: function(index) {
                     if(index==0){
                         self.addPic(1,callback);
                     }
                     else if(index==1){
                         self.addPic(2,callback);
                     }
                   return true;
                 }
            });
        },
        addPic:function(type,callback){
            var self=this;
            var opts={
                method:1,
                quality:50
            };
            if(type==2){ opts.method=0;}
            
            var onSuccess=function(data){
                
                var url="data:image/jpeg;base64," + data;
                //console.log(data.length);
                if(url.length>700000){
                    self.warn("图片太大啦，换一张吧！");
                    return;
                }
                
                
                Data.addFile(url);
                
               callback(url);
            };
            var onFail=function(d){alert(d);};
           Camera.getPic(onSuccess,onFail,opts,1);
        }
    };
})
.factory('houseInfo',function(Form,PersonalInfo){
    var data={};
    return {
        dataIn:function(o){
            for(var i in o){
                data[i]=o[i];
            }
        },
        dataOut:function(){
            return data;
        },
        update:function(callback){
            
            var self=this;
            var id=PersonalInfo.userId;
            Form.getData(id,function(data){
                if(data.errno==0){
                    self.dataIn(data.data);
                    callback(data.data);
                }
                else if(data.errno==1){
                    callback(data.message);
                }
            });
        }
    };
})
.factory('Camera',function(){
    return {
        /**
         *控制设备拍照
         *@param {Function} onSuccess
         *@param {Function} onFail
         *@param {Object} opts
         *      -width {Number} 照片的宽
         *      -height {Number} 照片的高
         *      -method {Number} 1:通过照相机   0:通过文件系统
         *      -quality {Number} 控制照片的质量，从1到100.无法对从文件系统中选取的文件起作用
         */
        getPic:function(onSuccess,onFail,opts,tag){
            var data={};
            data.encodingType=Camera.EncodingType.JPEG;
            //data.allowEdit=true;
            data.correctOrientation=true;
            if(tag) data.destinationType=Camera.DestinationType.DATA_URL;
            if(opts){
                if(opts.width) data.targetWidth=opts.width;
                if(opts.height) data.targetHeight=opts.height;
                opts.method?
                data.sourceType=Camera.PictureSourceType.CAMERA:
                data.sourceType=Camera.PictureSourceType.PHOTOLIBRARY;
                
                if(opts.quality) data.quality=opts.quality;
            }
            //alert(data);
            navigator.camera.getPicture(onSuccess, onFail, data);
        }
    };
})
.factory('house',function(Check,Data,Cmn,Form,$timeout){
    var warn=Cmn.warn;
    var toDels=[];
    return {
        resetForm1:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            $scope.data={
                title:'',
                price:'',
                area:'',
                community:''
            };
        },
        refreshForm1:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            var res=Data.getAll();
            delete res.description;
            $scope.data=res;
        },
        resetForm2:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            $scope.data={
                description:''
            };
        },
        refreshForm2:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            var res=Data.getAll();
            $scope.data={
                description:res.description
            };
        },
        resetPics:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            $scope.pics=[];
        },
        deletePic:function(index){
    
            var pic=Data.deleteFile(index);
            
            if(!/data:image\/jpeg;base64,/.test(pic)){
                var i=pic.lastIndexOf('/');
                var picId=pic.slice(i+1);
                /*Form.deletePics([picId],function(data){
                    console.log(data);
                });*/
                Data.addDelete(picId);
            }
        },
        updatePic:function(){
            //删除
            var arr=[];
            for(var i=0;i<toDels.length;i++){
                var index=toDels[i].lastIndexOf('/');
                arr.push(toDels[i].slice(index));
            }
            Form.deletePics(arr,function(data){
                console.log(data);
            });
            var pics=Data.getFiles();
            arr=[];
            for(i=0;i<pics.length;i++){
                if(/data:image\/jpeg;base64,/.test(pics[i]))
                arr.push(pics[i]);
            }
            Form.addPics(arr,function(data){
                console.log(data);
            });
        },
        picsOut:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            $scope.pics=Data.getFiles();
        },
        checkForm:function(callback){
            callback=callback||function(){};
            if(!Check.checkLen(Data.get('title'),100,1)){
                callback('title');
                return 0;
            }
            if(!Check.checkPrice(Data.get('price'))){
               callback('price');
                return 0;
            }
            if(!Check.checkLen(Data.get('community'),300,1)){
                callback('community');
                return 0;
            }
            if(!Check.checkLen(Data.get('area'),300,1)){
                callback('area');
                return 0;
            }
            if(!Check.checkLen(Data.get('description'),1000,1)){
                callback('description');
                return 0;
            }
            return 1;
        },
        checkWarnForm:function(){
            
            
            
            return this.checkForm(function(type){
                
                function todo(){
                    var el=document.querySelector('#house-form-'+type);
                    
                    $timeout(function(){el.focus();},500);
                }
                switch(type){
                    case 'title':
                        warn('标题长度不对',todo,2000,true);
                        break;
                    case 'price':
                        warn('价格格式不对',todo,2000,true);
                        break;
                    case 'community':
                        warn('小区长度不对',todo,2000,true);
                        break;
                    case 'area':
                        warn('地址或区域长度不对',todo,2000,true);
                        break;
                    case 'description':
                        warn('描述信息长度不对',function(){
                            location.href="#/house-decoration";
                        },2000);
                        break;
                }
            });
        },
        getFormData:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            Data.formDataIn($scope.data,true);
        },
        deletePics:function(callback){
            var arr=Data.getDeletes();
            Form.deletePics(arr,callback);
        },
        uploadPics:function(callback){
            var files=Data.getFiles();
            var toupload=[];
            for(var i=0;i<files.length;i++){
                if(/data:image\/jpeg;base64,/.test(files[i])){
                    toupload.push(files[i]);
                }
            }
            Form.addPics(toupload,callback);
        }
    };
})
;