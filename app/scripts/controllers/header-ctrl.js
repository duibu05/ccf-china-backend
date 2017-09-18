'use strict';

BDMpManagementApp
  .controller('HeaderCtrl', ['$scope', '$state', 'localStorageService', 'BdAuthority', 'toaster', function($scope, $state, localStorageService, BdAuthority, toaster) {
    $scope.user = localStorageService.get('user');
    $scope.signout = function(user) {
      BdAuthority.signout().then(function(res) {
        localStorageService.set('user', '');
        $state.go('signin');
      }, function(res) {
        toaster.clear();
        toaster.error('失败', '网络异常！');
      });
    };
  }]);
