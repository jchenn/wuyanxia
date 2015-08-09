ServiceModule
.factory('event',function(){
    var events={};
    return {
        on:function(event,fn){
            if(!events[event]){
                events[event]=[];
            }
            events[event].push(fn);
            return this;
        },
        trigger:function(event){
            if(events[event]){
                var arr=events[event];
                for(var i=0;i<arr.length;i++){
                    arr[i].apply(null,[].slice.call(arguments,1));
                }
            }
            return this;
        },
        off:function(event){
            events[event]=undefined;
            return this;
        }
    };
})
;