BDMpManagementApp
  .controller('SolutionCtrl', ['$scope', '$state', '$stateParams', 'ApplicationArea', 'Solution', 'toaster', function($scope, $state, $stateParams, ApplicationArea, Solution, toaster) {
    $scope.applicationAreaId = $stateParams.applicationAreaId;

    $scope.$watch('applicationAreaId', function() {
      if ($scope.applicationAreaId)
        $state.go('solutions', { applicationAreaId: $scope.applicationAreaId });
    });

    ApplicationArea.get({}, function(result) {
      if (!!result) {
        if (result.data.length === 0) {
          alert('请先添加应用领域！');
          $state.go('applicationAreas');
        } else {
          $scope.applicationAreas = result.data;

          $scope.applicationAreaId = $scope.applicationAreaId || result.data[0]._id;

          Solution.query({ category: 'application-area', _id: $scope.applicationAreaId }, function(result) {
            if (result && result.data) {
              $scope.solutions = result.data;
            }
          });
        }
      }

    })

    $scope.onDropComplete = function(index, obj, evt) {
      var otherObj = $scope.solutions[index];
      var otherIndex = $scope.solutions.indexOf(obj);
      $scope.solutions[index] = obj;
      $scope.solutions[otherIndex] = otherObj;

      for (var i = 0; i < $scope.solutions.length; i++) {
        var product = $scope.solutions[i];
        product.order = $scope.solutions.indexOf(product);

        Solution.update({ _id: product._id }, { solution: product }, function(result) {

        })
      }
    }

    $scope.del = function(_id, idx) {
      Solution.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功!');
        $scope.solutions.splice(idx, 1);
      });
    }
  }])
  .controller('SaveSolutionCtrl', ['$scope', '$state', '$stateParams', 'ApplicationArea', 'Solution', 'toaster', function($scope, $state, $stateParams, ApplicationArea, Solution, toaster) {
    var _id = $stateParams._id;
    $scope.action = _id ? '修改' : '添加';

    ApplicationArea.get({}, function(result) {
      if (!!result) {
        if (result.data.length === 0) {
          alert('请先添加产品应用领域！');
          $state.go('applicationAreas');
        } else {
          $scope.applicationAreas = result.data;
          $scope.applicationAreaId = result.data[0]._id;
          if (!!_id)
            Solution.get({ _id: _id }, function(result) {
              if (result && result.code === 200) {
                $scope.name = result.data.name;
                $scope.applicationAreaId = result.data.applicationArea._id;
              }
            });
        }
      }

    })

    $scope.save = function() {
      var solution = { name: this.name, applicationArea: { _id: this.applicationAreaId } };
      var index = 0;
      for (index in $scope.applicationAreas) {
        if (this.applicationAreaId === $scope.applicationAreas[index]._id) {
          solution.applicationArea.name = $scope.applicationAreas[index].name;
        }
      }

      if (!_id)
        Solution.save({}, { solution: solution }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('saveSolutionAdvantage', { _id: result.data._id });
        });
      else {
        solution._id = _id;
        Solution.update({ _id: _id }, { solution: solution }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('solutions', { applicationAreaId: solution.applicationArea._id });
        });
      }
    }
  }])
  .controller('SolutionTechSpecsCtrl', ['$scope', '$state', '$stateParams', 'Solution', 'toaster', function($scope, $state, $stateParams, Solution, toaster) {
    var _id = $stateParams._id;
    if (!!_id)
      Solution.get({ _id: _id }, function(result) {
        if (result && result.code === 200)
          $scope.solution = result.data;
      });

    $scope.del = function(index) {
      Solution.delete({ advantage: 'tech-spec', _id: _id, index: index }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.solution.techSpecs.splice(index, 1);
      });
    }
  }])
  .controller('SaveSolutionTechSpecCtrl', ['$scope', '$state', '$stateParams', 'Solution', 'toaster', function($scope, $state, $stateParams, Solution, toaster) {
    var index = $stateParams.index,
      _id = $stateParams._id;

    $scope.action = !!$stateParams.index ? '修改' : '新增';

    if (!!index)
      Solution.get({ _id: _id }, function(result) {
        if (result && result.data) {
          $scope.name = result.data.techSpecs[index].name;
          $scope.value = result.data.techSpecs[index].value;
        }
      });

    $scope.save = function() {
      var solution = { _id: _id, techSpecs: [{ name: this.name, value: this.value }] };
      if (!index)
        Solution.save({ advantage: 'tech-spec' }, { solution: solution }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('solutionTechSpecs', { _id: _id });
        });
      else
        Solution.update({ advantage: 'tech-spec', index: index }, { solution: solution }, function(result) {
          toaster.clear();
          toaster.success('成功', '修改成功！');
          $state.go('solutionTechSpecs', { _id: _id });
        });

    }
  }])
  .controller('SaveSolutionAdvantageCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'Solution', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, Solution, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
    var index = $stateParams.index,
      _id = $stateParams._id;
    $scope.layoutModels = [{ _id: 0, name: '左文右图' }, { _id: 1, name: '上文下图' }, { _id: 2, name: '左图右文' }, { _id: 3, name: '上图下文' }];
    $scope.layout = 0;
    $scope.action = !!$stateParams.index ? '修改' : '新增';
    $scope.btn = '保存';
    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });
    if (!!index)
      Solution.get({ _id: _id }, function(result) {
        if (result && result.data) {
          $scope.title = result.data.advantages[index].title;
          $scope.url = result.data.advantages[index].url;
          $scope.brief = result.data.advantages[index].brief;
          $scope.layout = result.data.advantages[index].layout || 0;
          $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + result.data.advantages[index].url;
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

    $scope.save = function() {
      var solution = { _id: _id, advantages: [{ title: this.title, url: this.url, brief: this.brief, layout: this.layout }] };
      if (!index)
        Solution.save({ advantage: 'advantage' }, { solution: solution }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('solutionAdvantages', { _id: _id });
        });
      else
        Solution.update({ advantage: 'advantage', index: index }, { solution: solution }, function(result) {
          toaster.clear();
          toaster.success('成功', '修改成功！');
          $state.go('solutionAdvantages', { _id: _id });
        });

    }
  }])
  .controller('SolutionAdvantageCtrl', ['$scope', '$state', '$stateParams', 'Solution', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', function($scope, $state, $stateParams, Solution, toaster, QINIU_DOWNLOAD_DOMAIN) {
    $scope.layoutModels = [{ _id: 0, name: '左文右图' }, { _id: 1, name: '上文下图' }, { _id: 2, name: '左图右文' }, { _id: 3, name: '上图下文' }];
    var _id = $stateParams._id;
    Solution.get({ _id: _id }, function(result) {
      var advantages = result.data.advantages;
      var i = 0;
      for (i in advantages)
        advantages[i].url = QINIU_DOWNLOAD_DOMAIN + advantages[i].url;
      $scope.solution = result.data;
    })

    $scope.del = function(index) {
      Solution.delete({ advantage: 'advantage', _id: _id, index: index }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.solution.advantages.splice(index, 1);
      });
    }
  }]);
