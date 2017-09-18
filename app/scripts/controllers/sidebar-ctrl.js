'use strict';

BDMpManagementApp
  .controller('SidebarCtrl', ['$scope', '$state', 'localStorageService', function($scope, $state, localStorageService) {
    $scope.isSuperAdmin = localStorageService.get('user').role === 0;

    $scope.collapse = function(obj) {
      // console.log('666');
    };
  }]);
