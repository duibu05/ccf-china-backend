'use strict';

BDMpManagementApp
  .controller('SigninCtrl', ['$scope', '$state', 'BdAuthority', 'toaster', 'localStorageService', function($scope, $state, BdAuthority, toaster, localStorageService) {

    if (angular.isObject(localStorageService.get('user')))
      $state.go('banner');
    $scope.signin = function(user) {
      BdAuthority.signin(user).then(function(res) {
        if (res.status === 200) {
          if (res.data.code === 200) {
            toaster.clear();
            toaster.success('成功', '登录成功！');
            localStorageService.set('user', res.data.data);
            $state.go('banner');
          } else if (res.data.code === 2002) {
            toaster.clear();
            toaster.error('失败', res.data.msg);
          } else {
            toaster.clear();
            toaster.error('失败', '网络异常！');
          }
        } else {
          toaster.clear();
          toaster.error('失败', '网络异常！');
        }
      }, function(res) {
        toaster.clear();
        toaster.error('失败', '网络异常！');
      });
    };
  }]);
