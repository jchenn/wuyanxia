angular.module('me.service', [])

.factory('QuizSubmit', function($resource) {
   // return $resource('http://10.242.37.68:4000/user/quiz', null, {
  return $resource('http://223.252.223.13/Roommates/api/user/quiz', null, {
    submit: {
      method: 'POST',
      transformRequest: function(obj) {
        // var str = [];
        // for(var p in obj)
        // str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        // return obj;
        return JSON.stringify(obj);
        // return str.join("&");
      },
      // headers: {'content-type': 'application/x-www-form-urlencoded'}
      headers: {'content-type': 'application/json'}
    }
  });
})

.factory('QuizModel', function() {
  var quiz = [
    // {name: 'yf', label: '您的身份', 
    //   choices: [
    //     {id: '2', image: 'img/image-m.png', answer: '我有房源，要招合租室友'},
    //     {id: '3', image: 'img/image-m.png', answer: '我无房源，要招人一块合租'}
    //   ]
    // },
    {name: 'zx', label: '生活作息上您是一个', 
      choices: [
        {id: '2', image: 'img/image-m.png', answer: '早起鸟'},
        {id: '3', image: 'img/image-m.png', answer: '夜猫子'}
      ]
    },
    {name: 'cy', label: '对抽烟您的感受', 
      choices: [
        {id: '2', image: 'img/image-m.png', answer: '我也抽烟'},
        {id: '3', image: 'img/image-m.png', answer: '无所谓'},
        {id: '4', image: 'img/image-m.png', answer: '讨厌烟味'}
      ]
    },
    {name: 'cw', label: '对小动物您的感受', 
      choices: [
        {id: '2', image: 'img/image-m.png', answer: '我养宠物'},
        {id: '3', image: 'img/image-m.png', answer: '都可以'},
        {id: '4', image: 'img/image-m.png', answer: '讨厌动物'}
      ]
    },
    {name: 'ws', label: '平时生活中您的私人物品', 
      choices: [
        {id: '2', image: 'img/image-m.png', answer: '整整齐齐'},
        {id: '3', image: 'img/image-m.png', answer: '突击清理'},
        {id: '4', image: 'img/image-m.png', answer: '随便放放'}
      ]
    },
    {name: 'fk', label: '生活中来您家访问的朋友', 
      choices: [
        {id: '2', image: 'img/image-m.png', answer: '高朋满座'},
        {id: '3', image: 'img/image-m.png', answer: '偶尔探望'},
        {id: '4', image: 'img/image-m.png', answer: '基本没有'}
      ]
    },
    {name: 'xg', label: '您认为您的个性', 
      choices: [
        {id: '2', image: 'img/image-m.png', answer: '开朗大方'},
        {id: '3', image: 'img/image-m.png', answer: '普普通通'},
        {id: '4', image: 'img/image-m.png', answer: '沉着稳重'}
      ]
    }
  ];

  var _choice = {},
      _byHint = false;

  var factory = {
    quiz: quiz,
    set: function(name, value) {
      _choice[name] = value;
    },
    get: function() {
      return _choice;
    },
    setByHint: function(byHint) {
      _byHint = byHint;
    },
    byHint: function() {
      return _byHint;
    }
  };

  return factory;
})

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