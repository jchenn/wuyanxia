angular.module('house.service',[])
.factory('UserInfo',function(){
    return {
        id:1
    };
})
.factory('myHttp',function(){
    function Http(method,url,data,callback){
        var xhr=new XMLHttpRequest();
        xhr.open(method,url);
        xhr.onreadystatechange=function(){
            if(xhr.status==200&&xhr.readyState==4){
                callback(xhr.responseText);
            }
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
    
    
    
    return {
        update:function(callback){
    
           var form=new FormData();
            form.append('userId',Number(PersonalInfo.userId));
            
            var data=Data.getAll();
            
            for(var i in data){
                if(i=='title'||i=='description'||i=='area'||i=='community'||i=='price')
                form.append(i,data[i]);
            }
            /*$http.post(host+updatePath,form,{
                 headers: { 
                     'Content-Type': 'application/x-www-form-urlencoded'
                 }
            }).success(callback);*/
            myHttp.http('POST',host+updatePath,form,function(data){
                callback(JSON.parse(data));
            });
            //$http.post(host+updatePath,Data.getAll()).success(callback);
        },
        add:function(callback){
            var filelist=Data.getFiles();
            
            var form=new FormData();
            
            if(!PersonalInfo.userId){alert('UserId 为空~~~');return ;}
            
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
            });
        },
        getData:function(id,callback){
            $http.get(host+getPath+id).success(function(d){
                callback(d);
            });
        },
        delete:function(callback){
            var id=PersonalInfo.userId;
            $http.get(host+deletePath+id).success(callback);
        }
    };
})
.factory('Data',function(){
    var data={};
    var fileList=[];
    return {
        get:function(key){
            return data[key]||"";
        },
        set:function(key,value){
            data[key]=value;
        },
        getAll:function(){
            return data;
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
            return fileList;
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
.factory('Cmn',function(Popup){
    
    return {
        warn:function(str,callback,tag){
            return Popup.show(str,callback,tag);
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
            data.allowEdit=true;
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
;