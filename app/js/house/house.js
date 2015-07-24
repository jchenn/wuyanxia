angular.module('house', ['house.ctrl', 'house.directive', 'house.service'])

.config(function($stateProvider) {

  // 与租房相关的视图
  $stateProvider

    // 房源列表
    .state('tab.house-list', {
      url: '/house-list',
      views: {
        'house-tab': {
          templateUrl: 'templates/house/house-list.html',
          controller: 'HouseCtrl'
        }
      }
    })

    // 房源详情
    .state('tab.house-detail', {
      url: '/house-detail/:id',
      views: {
        'house-tab': {
          templateUrl: 'templates/house/house-detail.html',
          controller: 'HouseDetailCtrl'
        }
      }
    });
})

.constant('AreaList', ['不限', '滨江', '西湖', '江干'])

.constant('PriceList', [
  {key: 1, value: '不限'},
  {key: 2, value: '500以下'},
  {key: 3, value: '500-1000'},
  {key: 4, value: '1000-1500'},
  {key: 5, value: '1500-2000'},
  {key: 6, value: '2000-3000'},
  {key: 7, value: '3000-5000'},
  {key: 8, value: '5000-8000'},
  {key: 9, value: '8000以上'}
])

.constant('RoomList', [
  {key: 1, value: '不限'},
  {key: 2, value: '一室'},
  {key: 3, value: '两室'},
  {key: 4, value: '三室'},
  {key: 5, value: '四室'},
  {key: 6, value: '四室以上'}
])

.constant('HTTP_PREFIX', 'http://10.242.37.68:4000');