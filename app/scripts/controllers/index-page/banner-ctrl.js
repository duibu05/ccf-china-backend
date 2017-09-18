'use strict';

BDMpManagementApp
  .controller('BannerCtrl', ['$scope', '$state', 'Banner', 'ApplicationArea', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', function($scope, $state, Banner, ApplicationArea, toaster, QINIU_DOWNLOAD_DOMAIN) {
    Banner.get({}, function(bannersRes) {
      ApplicationArea.get({}, function(applicationAreasRes) {
        var banners = bannersRes.data,
          applicationAreas = applicationAreasRes.data;
        for (var i = 0; i < banners.length; i++) {
          banners[i].url = QINIU_DOWNLOAD_DOMAIN + banners[i].url;
          for (var j = 0; j < applicationAreas.length; j++) {
            if (banners[i].applicationArea._id === applicationAreas[j]._id) {
              for (var k in applicationAreas[j].categories) {
                if (applicationAreas[j].categories[k]._id === banners[i].applicationArea.category._id)
                  banners[i].applicationArea.category.name = applicationAreas[j].categories[k].name;
              }
            }
          }
        }

        $scope.banners = banners;
      })
    });

    $scope.del = function(_id, index) {
      Banner.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功', '删除成功！');
        $scope.banners.splice(index, 1);
      })
    };
  }])
  .controller('RecommandedAACtrl', ['$scope', '$state', 'RecommandedAA', 'ApplicationArea', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', function($scope, $state, RecommandedAA, ApplicationArea, toaster, QINIU_DOWNLOAD_DOMAIN) {
    RecommandedAA.get({}, function(recommandedAARes) {
      ApplicationArea.get({}, function(applicationAreasRes) {
        var recommandedAAs = recommandedAARes.data,
          applicationAreas = applicationAreasRes.data;
        for (var i = 0; i < recommandedAAs.length; i++) {
          recommandedAAs[i].url = QINIU_DOWNLOAD_DOMAIN + recommandedAAs[i].url;
          for (var j = 0; j < applicationAreas.length; j++) {
            if (recommandedAAs[i].applicationArea === applicationAreas[j]._id) {
              recommandedAAs[i].applicationArea = applicationAreas[j];
            }
          }
        }

        $scope.recommandedAAs = recommandedAAs;
      })
    });

    $scope.del = function(_id, index) {
      RecommandedAA.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功', '删除成功！');
        $scope.recommandedAAs.splice(index, 1);
      })
    };
  }])
  .controller('SaveBannerCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'Banner', 'ApplicationArea', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, Banner, ApplicationArea, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
    $scope.btn = '保存';
    var _id = $stateParams._id;

    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });

    $scope.uploadFile = function(file) {
      $scope.previewUrl = '';
      $scope.btn = '准备上传...';
      if (!file.$error) {
        $scope.btn = '获取上传凭证...';
        BdQiniu.getUpToken().then(function(res) {
          if (res.status === 200 && !!res.data.token) {
            $scope.btn = '正在上传...';
            $scope.url = '';
            Upload.upload({
              url: QINIU_UPLOAD_DOMAIN,
              data: {
                token: res.data.token,
                file: file
              }
            }).then(function(resp) {
              if (resp.status === 200) {
                $scope.btn = '保存';
                $scope.url = resp.data.key;
                $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + resp.data.key;
                toaster.clear();
                toaster.success('成功', '上传成功！');
              } else {
                toaster.clear();
                toaster.error('失败', '上传失败，请重试！');
              }
            }, null, function(evt) {});
          }

        })

      }
    }

    ApplicationArea.get({}, function(result) {
      $scope.applicationAreas = result.data;
      $scope.applicationArea = result.data[0]._id;
      $scope.categories = result.data[0].categories;
      $scope.category = $scope.categories[0]._id;
      if (_id)
        Banner.get({ _id: _id }, function(banner) {
          $scope.title = banner.data.title;
          $scope.brief = banner.data.brief;
          $scope.url = banner.data.url;
          $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + banner.data.url;
          $scope.applicationArea = banner.data.applicationArea._id;
          for (var idx in $scope.applicationAreas)
            if ($scope.applicationAreas[idx]._id === banner.data.applicationArea._id) {
              $scope.categories = $scope.applicationAreas[idx].categories;
              $scope.category = banner.data.applicationArea.category._id;
            }
        });
    })

    $scope.$watch('applicationArea', function() {
      for (var i in $scope.applicationAreas)
        if ($scope.applicationAreas[i]._id === $scope.applicationArea) {
          $scope.categories = $scope.applicationAreas[i].categories;
          if (!_id)
            $scope.category = $scope.categories[0]._id;
        }
    });

    $scope.save = function() {
      var banner = { title: this.title, brief: this.brief, url: this.url, applicationArea: { _id: this.applicationArea, category: { _id: this.category } } };
      if (!_id)
        Banner.save({}, { banner: banner }, function(result) {
          if (result) {
            toaster.clear();
            toaster.success('成功', '添加成功！');
            $state.go('banner');
          }
        })
      else
        Banner.update({ _id: _id }, { banner: banner }, function(result) {
          if (result) {
            toaster.clear();
            toaster.success('成功', '修改成功！');
            $state.go('banner');
          }
        })
    };
  }])
  .controller('SaveRecommandedAACtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'RecommandedAA', 'ApplicationArea', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, RecommandedAA, ApplicationArea, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
    $scope.btn = '保存';
    var _id = $stateParams._id;

    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });

    $scope.uploadFile = function(file) {
      $scope.previewUrl = '';
      $scope.btn = '准备上传...';
      if (!file.$error) {
        $scope.btn = '获取上传凭证...';
        BdQiniu.getUpToken().then(function(res) {
          if (res.status === 200 && !!res.data.token) {
            $scope.btn = '正在上传...';
            $scope.url = '';
            Upload.upload({
              url: QINIU_UPLOAD_DOMAIN,
              data: {
                token: res.data.token,
                file: file
              }
            }).then(function(resp) {
              if (resp.status === 200) {
                $scope.btn = '保存';
                $scope.url = resp.data.key;
                $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + resp.data.key;
                toaster.clear();
                toaster.success('成功', '上传成功！');
              } else {
                toaster.clear();
                toaster.error('失败', '上传失败，请重试！');
              }
            }, null, function(evt) {});
          }

        })

      }
    }

    ApplicationArea.get({}, function(result) {
      $scope.applicationAreas = result.data;
      $scope.applicationArea = result.data[0]._id;
      if (_id)
        RecommandedAA.get({ _id: _id }, function(recommandedAA) {
          $scope.title = recommandedAA.data.title;
          $scope.brief = recommandedAA.data.brief;
          $scope.url = recommandedAA.data.url;
          $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + recommandedAA.data.url;
          $scope.applicationArea = recommandedAA.data.applicationArea;
        });
    })

    $scope.save = function() {
      var recommandedAA = { title: this.title, brief: this.brief, url: this.url, applicationArea: { _id: this.applicationArea, category: { _id: this.category } } };
      if (!_id)
        RecommandedAA.save({}, { recommandedAA: recommandedAA }, function(result) {
          if (result) {
            toaster.clear();
            toaster.success('成功', '添加成功！');
            $state.go('recommandedAA');
          }
        })
      else
        RecommandedAA.update({ _id: _id }, { recommandedAA: recommandedAA }, function(result) {
          if (result) {
            toaster.clear();
            toaster.success('成功', '修改成功！');
            $state.go('recommandedAA');
          }
        })
    };
  }]);
