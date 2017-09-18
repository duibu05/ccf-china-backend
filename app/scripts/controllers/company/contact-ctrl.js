BDMpManagementApp
  .controller('HeadOfficeCtrl', ['$scope', '$state', 'Contact', 'toaster', function($scope, $state, Contact, toaster) {
    $scope.emailFormat = /.+\@.+\..+/;

    Contact.get({ _id: 'headOffice' }, function(result) {
      if (result && result.data) {
        var contact = result.data;
        $scope.email = contact.email;
        $scope.address = contact.address;
        $scope.phone = contact.phone;
        $scope._id = contact._id;
      }
    });

    $scope.updateContact = function() {
      var contact = { _id: this._id, phone: this.phone, address: this.address, email: this.email, isHeadOffice: 1 };
      Contact.save({}, { contact: contact }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
      });
    }
  }])
  .controller('DistributorCtrl', ['$scope', '$state', 'Contact', 'toaster', function($scope, $state, Contact, toaster) {
    Contact.get({}, function(results) {
      if (results && results.code === 200) {
        $scope.distributors = results.data;
      }
    });

    $scope.delDistributor = function(_id, index) {
      Contact.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.distributors.splice(index, 1);
      });
    }
  }])
  .controller('SaveDistributorCtrl', ['$scope', '$state', '$stateParams', 'Contact', 'toaster', function($scope, $state, $stateParams, Contact, toaster) {
    var _id = $stateParams._id;
    if (!!_id)
      Contact.get({ _id: _id }, function(result) {
        if (result && result.code === 200) {
          var contact = result.data;
          $scope.name = contact.name;
          $scope.email = contact.email;
          $scope.address = contact.address;
          $scope.phone = contact.phone;
        }
      });

    $scope.saveDistributor = function() {
      var contact = { name: this.name, phone: this.phone, address: this.address, email: this.email, isHeadOffice: 0 };
      if (!!_id) {
        contact._id = _id;
      }
      Contact.save({}, { contact: contact }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('distributor');
      });
    }
  }]);
