angular.module('house.service',[])
.factory('UserInfo',function(){
    return {
        id:1
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
.factory('Form',function($http,Data,UserInfo,Check){
    var host="http://223.252.223.13";
    var updatePath="/Roommates/api/userhouse/update";
    var filePath="/Roommates/api/housePhoto/batchUpload";
    var addPath="/Roommates/api/userhouse/insert";
    var getPath="/Roommates/api/userhouse/";
    
    
    
    return {
        update:function(data){
            data.userId=UserInfo.id;
            $http.put(host+updatePath,data);
        },
        fileUpload:function(){
            var filelist=Data.getFiles();
            if(!filelist.length) return;
            var form=new FormData();
            form.append('userId',UserInfo.id);
            for(var i=0;i<filelist.length;i++){
                form.append('files['+i+']',filelist[i]);
            }
            $http.post(host+filePath,form);
        },
        add:function(){
            var data=Data.getAll();
            data.userId=UserInfo.id;
            $http.post(host+addPath,Data.getAll());
        },
        getData:function(id,callback){
            $http.get(host+getPath+id).success(function(data){
                var data=data.data;
                for(var i in data){
                    Data.set(i,data[i]);
                }
                callback(Data.getAll());
            });
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
.factory('Cmn',function(Check){
    
    function CheckForm(data){
        if(data.title){
            var str=Check.checkLen(data.title,30,1);
            if(!str) return "title";
            data.title=str;
        }
        
    }
    
    return {
        checkData:function(data){
            
        }
    };
})
;