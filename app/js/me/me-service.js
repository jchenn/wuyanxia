angular.module('me.service', [])

.factory('DayInit', function(){

    return {

        'yearArr' : [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995],
        'monthArr' : [1,2,3,4,5,6,7,8,9,10,11,12],
        'dayArr' : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        'year' : 1985,
        'month' : 1,
        'day' : 1

    }

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
          alert(data);
          navigator.camera.getPicture(onSuccess, onFail, data);
        }
      };
    })
;