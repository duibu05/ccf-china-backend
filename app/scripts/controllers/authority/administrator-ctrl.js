'use strict';

BDMpManagementApp
  .controller('AdministratorCtrl', ['$scope', '$state', 'Administrator', 'toaster', function($scope, $state, Administrator, toaster) {
    //获取所有管理员
    Administrator.query({}, function(result) {
      if (result.code === 200)
        $scope.admins = result.data;
      else if (result.code === 2004) {
        toaster.clear();
        toaster.error('失败！', '无权限！');
      }
    });

    $scope.delAdministrator = function(username, index) {
      Administrator.delete({ username: username }, function(result) {
        if (result.code === 2004) {
          toaster.clear();
          toaster.error('失败！', '无权限！');
          return;
        }
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.admins.splice(index, 1);
      });
    }
  }])
  .controller('AddAdministratorCtrl', ['$scope', '$state', 'Administrator', 'toaster', function($scope, $state, Administrator, toaster) {
    $scope.roles = [{ value: 0, name: '超级管理员' }, { value: 1, name: '内容编辑' }];
    $scope.role = $scope.roles[0].value;
    $scope.occupied = false;
    $scope.bdValid = {};
    $scope.emailFormat = /.+\@.+\..+/;


    $scope.$watch('username', function(newVal, oldVal) {
      Administrator.get({ username: newVal || 1 }, function(result) {
        if (result.code === 200 && angular.isObject(result.data))
          $scope.occupied = true;
        else {
          $scope.occupied = false;
          $scope.bdValid = {};
        }
      });
    });

    $scope.addAdmin = function() {
      var admin = { username: this.username, password: this.password, role: this.role, name: this.name, phone: this.phone };

      Administrator.save({}, { user: admin }, function(result) {
        if (result.code === 200) {
          toaster.clear();
          toaster.success('成功！', '添加成功');
          $state.go('administrator');
        } else if (result.code === 1000)
          $scope.bdValid = result.data;
        else if (result.code === 2000)
          $scope.occupied = true;
        else if (result.code === 2004) {
          toaster.clear();
          toaster.error('失败！', '无权限！');
        } else if (result.code === 500) {
          toaster.clear();
          toaster.pop('error', "title", 'Bill');
        }

      });
    };
  }])
  .controller('ModifyAdministratorCtrl', ['$scope', '$state', 'Administrator', 'toaster', '$stateParams', 'localStorageService', function($scope, $state, Administrator, toaster, $stateParams, localStorageService) {
    $scope.roles = [{ value: 0, name: '超级管理员' }, { value: 1, name: '内容编辑' }];
    $scope.role = $scope.roles[0].value;
    $scope.occupied = false;
    $scope.bdValid = {};
    $scope.emailFormat = /.+\@.+\..+/;

    Administrator.get({ username: $stateParams.username }, function(result) {
      if (result.code === 200) {
        $scope._id = result.data._id;
        $scope.role = result.data.role;
        $scope.name = result.data.name;
        $scope.username = result.data.username;
        $scope.phone = result.data.phone;
      }
    });


    $scope.$watch('username', function(newVal, oldVal) {
      if (oldVal && $stateParams.username !== newVal) {
        Administrator.get({ username: newVal || 1 }, function(result) {
          if (result.code === 200 && angular.isObject(result.data))
            $scope.occupied = true;
          else {
            $scope.occupied = false;
            $scope.bdValid = {};
          }
        });
      }
    });

    $scope.modifyAdmin = function() {
      var admin = { _id: this._id, username: this.username, role: this.role, name: this.name, phone: this.phone };

      Administrator.update({ username: this.username }, { user: admin }, function(result) {
        if (result.code === 200) {
          toaster.clear();
          toaster.success('成功！', '修改成功');
          var localUser = localStorageService.get('user');

          if (localUser._id === admin._id)
            localStorageService.set('user', result.data);
          $state.go('administrator');
        } else if (result.code === 1000)
          $scope.bdValid = result.data;
        else if (result.code === 2000)
          $scope.occupied = true;
        else if (result.code === 2004) {
          toaster.clear();
          toaster.error('失败！', '无权限！');
        } else if (result.code === 500) {
          toaster.clear();
          toaster.pop('error', "错误", result.msg);
        }
      });
    };
  }])
  .controller('ResetPasswordCtrl', ['$scope', '$state', 'Administrator', 'Password', 'toaster', '$stateParams', 'localStorageService', function($scope, $state, Administrator, Password, toaster, $stateParams, localStorageService) {

    $scope.hideTip = $stateParams.username === localStorageService.get('user').username;
    console.log($stateParams.username);
    console.log(localStorageService.get('user').username);
    console.log($scope.hideTip);

    Administrator.get({ username: $stateParams.username }, function(result) {
      if (result.code === 200) {
        $scope._id = result.data._id;
        $scope.name = result.data.name;
      }
    });

    $scope.resetPassword = function() {
      var admin = { _id: this._id, password: this.password };

      Password.update({ username: this._id }, { user: admin }, function(result) {
        if (result.code === 200) {
          var localUser = localStorageService.get('user');

          if (localUser._id === admin._id) {
            localStorageService.set('user', '');
            toaster.clear();
            toaster.success('成功！', '修改成功，请重新登录！');
            $state.go('signin');
          } else {
            toaster.clear();
            toaster.success('成功！', '修改成功，请通知该管理员！');
            $state.go('administrator');
          }
        } else if (result.code === 2004) {
          toaster.clear();
          toaster.error('失败！', '无权限！');
        } else if (result.code === 500) {
          toaster.clear();
          toaster.pop('error', "错误", result.msg);
        }
      });
    };
  }]);
