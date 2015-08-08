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
.factory('TakePhoto',function($ionicActionSheet, $http, $timeout, PersonalInfoMange){
  return {

      //选择拍照或者上传照片

      takePhoto : function (method) {
            var self = this;

          //清除缓存
          navigator.camera.cleanup( function(){
              console.log("Camera cleanup success.")
          }, function(message) {
              console.log('Failed because: ' + message);
          });

          navigator.camera.getPicture(onSuccess, onFail, method);


          function onSuccess(imageData) {
              //显示图片
              var image = document.getElementById('myImage');
              var picData = "data:image/jpeg;base64," + imageData;
              image.src = picData;
              //更新本地缓存
              PersonalInfoMange.update({'avatar' : picData});
              console.log('wo shi service');

              self.uploadPic(imageData);
              console.log(111);

              //上传图片
          }

          function onFail(message) {
              console.log('Failed because: ' + message);
          }
      },
        //上传图片
    uploadPic : function(imageData){

        var data = {
            'file' : "data:image/jpg:base64," + imageData,
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
                //PersonalInfoMange.update({'avatar' : response.imgUrl})
                return response.imgUrl;
            }else if(response.errono == 1){
                console.log('上传图片失败' + response.message);
            }
        }).error(function(response){
            console.log(response);
        })

    },
     //显示选择框
    showCamera : function(scope) {
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
                    });
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
                    });

                }
                hideSheet();
            }
        });
        $timeout(function () {
            hideSheet();
        }, 2000);
    }
  };
}).factory('dateSelect',function(PersonalInfoMange){

        return {


            showDate : function(scope, http, flag){

            var options = {
                date: new Date(),
                mode: 'date',
                minDate: new Date(),
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: '确定',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: '取消',
                cancelButtonColor: '#cccccc',
                androidTheme: 3

            };
            function success(date){

                var time = new Date(date).valueOf();
                PersonalInfoMange.update({'birthday' : time});
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