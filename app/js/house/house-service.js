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
.factory('Popup',function(){
    
    var cover=document.createElement('div');
        
    cover.style.display="none";
    
    cover.classList.add('m-cover');
    
    cover.classList.add('house-view');
    
    cover.innerHTML=
    '<div class="m-cover">'+
        '<div class="m-pop">'+
            '<div class="m-pop-content f-wwa">'+
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
        init:function(){
            if(isInited) return;
            var self=this;
            var parent=document.body;
            parent.appendChild(cover);
            cover.addEventListener('click',function(event){
                self.hide();
            });
            isInited=true;
        },
        show:function(str,callback,tag){
            var self=this;
            if(!isInited) this.init(callback,tag);
            cover.querySelector('.m-pop-content').innerHTML=str;
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
    
          /* var form=new FormData();
            form.append('userId',Number(PersonalInfo.userId));
            
            var data=Data.getAll();
            
            for(var i in data){
                if(i=='title'||i=='description'||i=='area'||i=='community'||i=='price')
                form.append(i,data[i]);
            }
            myHttp.http('POST',host+updatePath,form,function(data){
                try{
                     callback(JSON.parse(data));
                }
                catch(e){
                     callback({
                         errno:1,
                         message:data
                     });
                }
               
            });*/
            //$http.post(host+updatePath,Data.getAll()).success(callback);
            var data={
                userId:PersonalInfo.userId
            };
            var form=Data.getAll();
            for(var i in form) data[i]=form[i];
            $http.post(host+updatePath,data).success(callback);
        },
        add:function(callback){
          /*  var filelist=Data.getFiles();
            
            var form=new FormData();
            
            if(!PersonalInfo.userId){alert('UserId 为空~~~,我先赋值为1了');PersonalInfo.userId=1;}
            
            form.append('userId',Number(PersonalInfo.userId));

            if(filelist.length) {
                for(var i=0;i<filelist.length;i++){
                    form.append('files['+i+']',filelist[i]);
                }
            }
            
            var data=Data.getAll();
            for(var i in data){
                form.append(i,data[i]);
            }
            //$http.post(host+addPath,{a:1,b:2}).success(callback);
            myHttp.http('POST',host+addPath,form,function(data){
                callback(JSON.parse(data));
            });*/
            
            var data={
                userId:PersonalInfo.userId,
                files:Data.getFiles()
            };
            var form=Data.getAll();
            for(var i in form) data[i]=form[i];
            
            $http.post(host+addPath,data).success(callback);
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
        addPics:function(data,callback){
            var d={
                userId:PersonalInfo.userId,
                images:data
            };
            $http.post(host+addpicPath,d).success(callback);
        }
    };
})
.factory('Data',function(){
    var data={
        title:'',
        price:'',
        community:'',
        area:'',
        description:''
    };
    var fileList=[];
    return {
        get:function(key){
            return data[key]||"";
        },
        set:function(key,value){
            data[key]=value;
        },
        getAll:function(){
            var res={};
            for(var i in data){
                res[i]=data[i];
            }
            return res;
        },
        fill:function(target){
            for(var i in target){
                data[i]=target[i];
            }
        },
        addFile:function(file){
            fileList.push(file);
        },
        getFiles:function(){
            return fileList.slice(0);
        },
        deleteFile:function(index){
            return fileList.splice(index,1)[0];
        },
        clearPics:function(){
            fileList=[];
        },
        formDataIn:function(form){
            for(var i in form){
                if(typeof data[i]!=undefined) data[i]=form[i];
            }
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
.factory('Cmn',function(Popup,$ionicHistory){
    
    return {
        warn:function(str){
            return Popup.show(str);
        },
        back:function(){
            //console.log('back');
            $ionicHistory.goBack();
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
            //data.correctOrientation=true;
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
.factory('house',function(Check,Data,Cmn,Form){
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
            /*if(!/data:image\/jpeg;base64,/.test(pic)){
                var i=pic.lastIndexOf('/');
                var picId=pic.slice(i+1);
                Form.deletePics([picId],function(data){
                    console.log(data);
                });
            }*/
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
                switch(type){
                    case 'title':
                        warn('标题长度不对');
                        break;
                    case 'price':
                        warn('价格格式不对');
                        break;
                    case 'community':
                        warn('小区长度不对');
                        break;
                    case 'area':
                        warn('地址或区域长度不对');
                        break;
                    case 'description':
                        warn('描述信息长度不对');
                        break;
                }
            });
        },
        getFormData:function($scope){
            if(!$scope) throw new Error('参数忘加了');
            Data.formDataIn($scope.data);
        }
    };
})
;