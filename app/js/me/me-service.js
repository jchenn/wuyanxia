angular.module('me.service', [])

.factory('DayInit', function(){

        var initData = {
            'nickName' : '',
            'sex' : '',
            'birthday' : '',
            'job' : '',
            'phone' : '',
            'avatar' : ''
        };

        return {

            saveTempData : function(dataObj){

                for(var key in dataObj){
                    initData[key] = dataObj[key];
                }

            }

        }

})
.factory('TakePhoto',function($ionicActionSheet, $http, $timeout, PersonalInfoMange){

        var flag = '';

  return {


      //选择拍照或者上传照片

      takePhoto : function (method,callBack) {
            var self = this;
          navigator.camera.getPicture(onSuccess, onFail, method);


          function onSuccess(imageData) {
              //显示图片
              var image = document.getElementById('myImage');
              var picData = "data:image/jpeg;base64," + imageData;
              image.src = picData;

              callBack(picData);

              //如果是个人信息填写 就不用上传图片；
              if(flag != 0){
                  //上传图片
                  self.uploadPic(imageData);
              }

          }

          function onFail(message) {
              console.log('Failed because: ' + message);
          }
      },
        //上传图片
    uploadPic : function(imageData){

        var data = {
            'file' : "data:image/jpeg;base64," + imageData,
            'userId' : PersonalInfoMange.get('userId')
        };
        var res = $http({
            method: 'post',
            url: 'http://223.252.223.13/Roommates/api/photo/upload',
            data: data,
            timeout: 2000
        });
        res.success(function(response){
            if(response.errono == 0){
                //$scope.data.avatar = response.imgUrl;
                //console.log(response.imgUrl);
                //PersonalInfoMange.update({'avatar' : response.imgUrl});
                PersonalInfoMange.update({'avatar' : "data:image/jpeg;base64," + imageData});
                //return response.imgUrl;
            }else if(response.errono == 1){
                console.log('上传图片失败' + response.message);
            }
        }).error(function(response){
            console.log(response);
        })

    },
     //显示选择框
    showCamera : function(num, callBack) {
        flag = num;
        var self = this;
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                {text: '拍照'},
                {text: '从相册中选取'}
            ],
            cancelText: '取消',
            cancel: function () {
                hideSheet();
            },
            buttonClicked: function (index) {
                if (index == 0) {
                    console.log('我要拍照2');
                    self.takePhoto({
                        quality: 100,
                        destinationType: Camera.DestinationType.DATA_URL,
                        encodingType: Camera.EncodingType.JPEG,
                        allowEdit: true,
                        targetWidth: 200,
                        targetHeight: 200,
                        sourceType: Camera.PictureSourceType.CAMERA
                    },callBack);
                } else if (index == 1) {
                    console.log('我要选照片');
                    self.takePhoto({
                        quality: 100,
                        destinationType: Camera.DestinationType.DATA_URL,
                        allowEdit: true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 200,
                        targetHeight: 200,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                    },callBack);

                }
                hideSheet();
            }
        });
    }
  };
}).factory('dateSelect',function(PersonalInfoMange){

        return {


            showDate : function(scope, http, flag){

            var options = {
                date: new Date('3-20-1985'),
                mode: 'date',
                minDate: new Date('3-20-1985'),
                maxDate: new Date('3-20-1985'),
                androidTheme: 3

            };
            function success(date){

                var time = new Date(date).valueOf();
                //PersonalInfoMange.update({'birthday' : time});
                scope.$apply(function () {
                    scope.data.birthday = time;
                });

                if(!!flag){
                    sendRequest(time);
                }
            }
            function fail(err){
                console.log(err);
            }

            function sendRequest(time){

                var obj = {};
                obj['birthday'] = time;
                //给服务器发请求
                var res = http({
                    method: 'post',
                    url: 'http://223.252.223.13/Roommates/api/user/updateUserBasicInfo',
                    data: obj,
                    timeout: 2000,
                    headers:{
                        'If-Modified-Since': new Date()
                    }
                });

                res.success(function(response, status, headers, config){
                    if(response.errno == 0){
                        if(response.finishInfo == 1){
                            PersonalInfoMange.update({'completeInfo' : true});
                        }

                        scope.go('/menu/me');

                    }else if(response.errno == 1){
                        alert(response.message);
                    }
                }).error(function(response, status, headers, config){
                    alert(response.message);
                });

            }
            datePicker.show(options, success, fail);

        }

        }


    })
;