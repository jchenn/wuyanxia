ServiceModule
.factory('event',function(){
    var events={};
    return {
        on:function(event,fn){
            if(!events[event]){
                events[event]=[];
            }
            events[event].push(fn);
        },
        trigger:function(event){
            if(events[event]){
                var arr=events[event];
                for(var i=0;i<arr.length;i++){
                    arr[i].apply(null,[].slice.call(arguments,1));
                }
            }
        }
    };
})
;