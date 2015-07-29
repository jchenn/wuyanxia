ServiceModule
.factory('Check',function(){
    return {
        checkLen:function(str,max,min){
            var min=min||0;
            var len=this.getLen(str);
            if(len>max||len<min){
                return false;
            }
            return this.parse(str);
        },
        checkPrice:function(str,max){
            var max=max||10;
            var reg=/^[0-9]+(\.[0-9]+)?$/;
            if(reg.test(str)){
                return str;
            }
            return false;
        },
        getLen:function(str){
            var realLength = 0;  
            for (var i = 0; i < str.length; i++)   
            {  
                charCode = str.charCodeAt(i);  
                if (charCode >= 0 && charCode <= 128)   
                realLength += 1;  
                else   
                realLength += 2;  
            }  
            return realLength;  
        },
        parse:function(str){
            var reg=/[<>]/g;
            return str.replace(reg,function(str){
                if(str=='<')
                    return "&lg;";
                if(str=='>')
                    return "&gt;";
            });
        }
    };
})
;