angular.module('house.service',[])
.factory('Pop',function(){
    
    var cover=document.createElement('div');
    
    cover.style.display="none";
    
    cover.classList.add('m-cover');
    
    cover.innerHTML=
    '<div class="m-cover">'+
        '<div class="m-pop">'+
            '<div class="m-pop-content f-wwa">'+
                '我是汉字啊，啦啦啦啦啦啦啦啦拉拉啦啦，我不换行~~~'+
            '</div>'+
            '<div class="m-pop-btns">'+
                '<button class="m-btn t-cancel">取消</button>'+
                '<button class="m-btn t-sure">确定</button>'+
            '</div>'+
        '</div>'+
    '</div>';
    
    //貌似没啥用
    var isInited=false;
    
    return {
        
        /**
         *@para {Object} options
         *      -sure {Function} 点击确定时执行
         *      -cancel {Function} 点击取消时执行
         */
        init:function(o){
            var self=this;
            var parent=document.querySelector('.house-view');
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
        },
        show:function(){
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
;