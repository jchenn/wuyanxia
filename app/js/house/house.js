angular.module('house',['house.ctrl','house.service'])
.config(function($stateProvider){
    $stateProvider.state('houseNew',{
        url:'/house-new',
        
        templateUrl:'templates/house/house-new.html',
        controller:'newCtrl'
    })
    .state('housedesc',{
        url:'/house-decoration',
        templateUrl:'templates/house/house-decoration.html',
        controller:'descCtrl'
    })
    .state('houseUpdate',{
        url:'/house-update',
        
        templateUrl:'templates/house/house-new.html',
        controller:'updateCtrl'
    })
    .state('housedescUpdate',{
        url:'/house-desc-update',
        
        templateUrl:'templates/house/house-decoration.html',
        controller:'descupdateCtrl'
    })
    .state('picEdit',{
        url:'/pic-edit',
        
        templateUrl:'templates/house/pic-edit.html',
        controller:'piceditCtrl'
    })
    ;
})
;