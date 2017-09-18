BDMpManagementApp
  .controller('ApplicationAreaCtrl', ['$scope', '$state', 'ApplicationArea', 'toaster', function($scope, $state, ApplicationArea, toaster) {
    ApplicationArea.get({}, function(result) {
      if (result && result.data) {
        $scope.applicationAreas = result.data;
      }
    });

    $scope.onDropComplete = function(index, obj, evt) {
      var otherObj = $scope.applicationAreas[index];
      var otherIndex = $scope.applicationAreas.indexOf(obj);
      $scope.applicationAreas[index] = obj;
      $scope.applicationAreas[otherIndex] = otherObj;

      for (var i = 0; i < $scope.applicationAreas.length; i++) {
        var applicationArea = $scope.applicationAreas[i];
        applicationArea.order = $scope.applicationAreas.indexOf(applicationArea);

        ApplicationArea.update({ _id: applicationArea._id }, { applicationArea: applicationArea }, function(result) {

        })
      }
    }

    $scope.getApplicationAreasCategories = function(applicationArea) {
      var categories = applicationArea.categories;
      var categoriesStr = '';
      if (categories.length === 0)
        return categoriesStr;
      categoriesStr = categories[0].name;
      var i = 0;
      for (var i = 1; i < categories.length; i++)
        categoriesStr += ',' + categories[i].name;
      return categoriesStr;
    }

    $scope.delApplicationArea = function(_id, index) {
      ApplicationArea.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功!');
        $scope.applicationAreas.splice(index, 1);
      });
    }
  }])
  .controller('ProductCategoryCtrl', ['$scope', '$state', '$stateParams', 'ApplicationArea', 'toaster', function($scope, $state, $stateParams, ApplicationArea, toaster) {
    ApplicationArea.get({ _id: $stateParams.applicationAreaId }, function(result) {
      if (result && result.data) {
        $scope.applicationArea = result.data;
      }
    });

    $scope.onDropComplete = function(index, obj, evt) {
      var otherObj = $scope.applicationArea.categories[index];
      var otherIndex = $scope.applicationArea.categories.indexOf(obj);
      $scope.applicationArea.categories[index] = obj;
      $scope.applicationArea.categories[otherIndex] = otherObj;
      ApplicationArea.update({ _id: $scope.applicationArea._id }, { applicationArea: $scope.applicationArea }, function(result) {

      });
    }

    $scope.del = function(_id, index) {
      ApplicationArea.delete({ _id: _id, categoryIndex: index }, function(result) {
        if (!!result && result.code === 200) {
          toaster.clear();
          toaster.success('成功！', '删除成功!');
          $scope.applicationArea.categories.splice(index, 1);
        } else if (!!result && result.code === 3000) {
          toaster.clear();
          toaster.error('失败！', '删除失败，' + result.msg + '!');
        }
      });
    }
  }])
  .controller('UpdateProductCategoryCtrl', ['$scope', '$state', '$stateParams', 'ApplicationArea', 'toaster', function($scope, $state, $stateParams, ApplicationArea, toaster) {
    $scope.name = $stateParams.name;
    var index = $stateParams.index;
    var _id = $stateParams.applicationAreaId;
    var applicationAreaId = $stateParams.applicationAreaId;

    $scope.save = function() {
      ApplicationArea.update({ _id: _id, categoryIndex: index }, { category: { name: this.name } }, function(result) {
        toaster.clear();
        toaster.success('成功！', '修改成功!');
        $state.go('productCategory', { applicationAreaId: _id });
      });
    }
  }])
  .controller('SaveApplicationAreaCtrl', ['$scope', '$state', '$stateParams', 'ApplicationArea', 'toaster', function($scope, $state, $stateParams, ApplicationArea, toaster) {
    var _id = $stateParams._id;
    $scope.action = _id ? '修改' : '添加';
    if (!!_id)
      ApplicationArea.get({ _id: _id }, function(result) {
        if (result && result.code === 200) {
          $scope.name = result.data.name;
          var categories = result.data.categories;
          $scope.categories = categories[0].name;
          var i = 0;
          for (var i = 1; i < categories.length; i++)
            $scope.categories += ',' + categories[i].name;
        }
      });

    $scope.save = function() {
      var applicationArea = { name: this.name, categories: [] };
      var categoriesArray = this.categories.split(',');
      var category = 0;
      for (category in categoriesArray) {
        applicationArea.categories.push({ name: categoriesArray[category] })
      }

      if (!_id)
        ApplicationArea.save({}, { applicationArea: applicationArea }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('applicationAreas');
        });
      else {
        applicationArea._id = _id;
        ApplicationArea.update({ _id: _id }, { applicationArea: applicationArea }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('applicationAreas');
        });
      }
    }
  }])
  .controller('ProductCtrl', ['$scope', '$state', '$stateParams', 'ApplicationArea', 'Product', 'toaster', function($scope, $state, $stateParams, ApplicationArea, Product, toaster) {
    $scope.applicationAreaId = $stateParams.applicationAreaId;
    $scope.productCategoryId = $stateParams.productCategoryId;

    // console.log(applicationAreaId + '-' + productCategoryId);

    $scope.$watch('applicationAreaId', function() {
      var k = 0;
      for (k in $scope.applicationAreas) {
        if ($scope.applicationAreaId === $scope.applicationAreas[k]._id) {
          $scope.productCategories = $scope.applicationAreas[k].categories;
          $scope.productCategoryId = $scope.productCategories[0]._id;
          $scope.productCategories = $scope.applicationAreas[k].categories;
        }
      }
    });

    $scope.$watch('productCategoryId', function() {
      if ($scope.productCategoryId)
      // Product.query({ category: 'category', _id: $scope.productCategoryId }, function(result) {
      //   if (result && result.data) {
      //     $scope.products = result.data;
      //   }
      // });

        $state.go('products', { applicationAreaId: $scope.applicationAreaId, productCategoryId: $scope.productCategoryId });
    });

    ApplicationArea.get({}, function(result) {
      if (!!result) {
        if (result.data.length === 0) {
          alert('请先添加产品应用领域！');
          $state.go('applicationAreas');
        } else {
          $scope.applicationAreas = result.data;

          if ($scope.applicationAreaId && $scope.productCategoryId) {
            var j = 0;
            for (j in $scope.applicationAreas) {
              if ($scope.applicationAreaId === $scope.applicationAreas[j]._id) {
                $scope.productCategories = $scope.applicationAreas[j].categories;
              }
            }
          } else {
            $scope.applicationAreaId = result.data[0]._id;
            $scope.productCategories = result.data[0].categories;
            $scope.productCategoryId = result.data[0].categories[0]._id;
          }
          Product.query({ category: 'category', _id: $scope.productCategoryId }, function(result) {
            if (result && result.data) {
              $scope.products = result.data;
            }
          });
        }
      }

    })
    $scope.onDropComplete = function(index, obj, evt) {
      var otherObj = $scope.products[index];
      var otherIndex = $scope.products.indexOf(obj);
      $scope.products[index] = obj;
      $scope.products[otherIndex] = otherObj;

      for (var i = 0; i < $scope.products.length; i++) {
        var product = $scope.products[i];
        product.order = $scope.products.indexOf(product);

        Product.update({ _id: product._id }, { product: product }, function(result) {

        })
      }
    }

    $scope.del = function(_id, idx) {
      Product.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功!');
        $scope.products.splice(idx, 1);
      });
    }
  }])
  .controller('SaveProductCtrl', ['$scope', '$state', '$stateParams', 'ApplicationArea', 'Product', 'toaster', function($scope, $state, $stateParams, ApplicationArea, Product, toaster) {
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
          $scope.productCategories = result.data[0].categories;
          $scope.productCategoryId = result.data[0].categories[0]._id;
          if (!!_id)
            Product.get({ _id: _id }, function(result) {
              if (result && result.code === 200) {
                $scope.name = result.data.name;
                $scope.applicationAreaId = result.data.applicationArea._id;
                $scope.productCategoryId = result.data.applicationArea.category._id;
                var index = 0;
                for (index in $scope.applicationAreas)
                  if ($scope.applicationAreaId === $scope.applicationAreas[index]._id)
                    $scope.productCategories = $scope.applicationAreas[index].categories;
              }
            });
        }
      }

    })

    $scope.$watch('applicationAreaId', function() {
      var index = 0;
      for (index in $scope.applicationAreas) {
        if ($scope.applicationAreaId === $scope.applicationAreas[index]._id) {
          $scope.productCategories = $scope.applicationAreas[index].categories;
          if (!_id)
            $scope.productCategoryId = $scope.productCategories[0]._id;
        }
      }
    })

    $scope.save = function() {
      var product = { name: this.name, applicationArea: { _id: this.applicationAreaId, category: { _id: this.productCategoryId } } };
      var index = 0;
      for (index in $scope.applicationAreas) {
        if (this.applicationAreaId === $scope.applicationAreas[index]._id) {
          product.applicationArea.name = $scope.applicationAreas[index].name;
          var categories = $scope.applicationAreas[index].categories;
          var i = 0;
          for (i in categories)
            if (this.productCategoryId === categories[i]._id)
              product.applicationArea.category.name = categories[i].name;
        }
      }

      if (!_id)
        Product.save({}, { product: product }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('saveProductAdvantage', { _id: result.data._id });
        });
      else {
        product._id = _id;
        Product.update({ _id: _id }, { product: product }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('products', { applicationAreaId: product.applicationArea._id, productCategoryId: product.applicationArea.category._id });
        });
      }
    }
  }])
  .controller('TechSpecsCtrl', ['$scope', '$state', '$stateParams', 'Product', 'toaster', function($scope, $state, $stateParams, Product, toaster) {
    var _id = $stateParams._id;
    if (!!_id)
      Product.get({ _id: _id }, function(result) {
        if (result && result.code === 200)
          $scope.product = result.data;
      });

    $scope.del = function(index) {
      Product.delete({ advantage: 'tech-spec', _id: _id, index: index }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.product.techSpecs.splice(index, 1);
      });
    }
  }])
  .controller('SaveTechSpecCtrl', ['$scope', '$state', '$stateParams', 'Product', 'toaster', function($scope, $state, $stateParams, Product, toaster) {
    var index = $stateParams.index,
      _id = $stateParams._id;

    $scope.action = !!$stateParams.index ? '修改' : '新增';

    if (!!index)
      Product.get({ _id: _id }, function(result) {
        if (result && result.data) {
          $scope.name = result.data.techSpecs[index].name;
          $scope.value = result.data.techSpecs[index].value;
        }
      });

    $scope.save = function() {
      var product = { _id: _id, techSpecs: [{ name: this.name, value: this.value }] };
      if (!index)
        Product.save({ advantage: 'tech-spec' }, { product: product }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('techSpecs', { _id: _id });
        });
      else
        Product.update({ advantage: 'tech-spec', index: index }, { product: product }, function(result) {
          toaster.clear();
          toaster.success('成功', '修改成功！');
          $state.go('techSpecs', { _id: _id });
        });

    }
  }])
  .controller('SaveProductAdvantageCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'Product', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, Product, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
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
      Product.get({ _id: _id }, function(result) {
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
      var product = { _id: _id, advantages: [{ title: this.title, url: this.url, brief: this.brief, layout: this.layout }] };
      if (!index)
        Product.save({ advantage: 'advantage' }, { product: product }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('productAdvantages', { _id: _id });
        });
      else
        Product.update({ advantage: 'advantage', index: index }, { product: product }, function(result) {
          toaster.clear();
          toaster.success('成功', '修改成功！');
          $state.go('productAdvantages', { _id: _id });
        });

    }
  }])
  .controller('ProductAdvantageCtrl', ['$scope', '$state', '$stateParams', 'Product', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', function($scope, $state, $stateParams, Product, toaster, QINIU_DOWNLOAD_DOMAIN) {
    $scope.layoutModels = [{ _id: 0, name: '左文右图' }, { _id: 1, name: '上文下图' }, { _id: 2, name: '左图右文' }, { _id: 3, name: '上图下文' }];
    var _id = $stateParams._id;
    Product.get({ _id: _id }, function(result) {
      var advantages = result.data.advantages;
      var i = 0;
      for (i in advantages)
        advantages[i].url = QINIU_DOWNLOAD_DOMAIN + advantages[i].url;
      $scope.product = result.data;
    })

    $scope.del = function(index) {
      Product.delete({ advantage: 'advantage', _id: _id, index: index }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.product.advantages.splice(index, 1);
      });
    }
  }])
  .controller('ApplicationAreaAdvantageCtrl', ['$scope', '$state', '$stateParams', 'ApplicationAreaAdvantage', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', function($scope, $state, $stateParams, ApplicationAreaAdvantage, toaster, QINIU_DOWNLOAD_DOMAIN) {
    $scope.applicationArea = { name: $stateParams.applicationAreaName, _id: $stateParams.applicationAreaId };
    $scope.layoutModels = [{ _id: 0, name: '左文右图' }, { _id: 1, name: '上文下图' }, { _id: 2, name: '左图右文' }, { _id: 3, name: '上图下文' }];
    ApplicationAreaAdvantage.get({ queryCondition: 'application-area', _id: $stateParams.applicationAreaId }, function(result) {
      var advantages = result.data;
      var i = 0;
      for (i in advantages)
        advantages[i].url = QINIU_DOWNLOAD_DOMAIN + advantages[i].url;
      $scope.advantages = result.data;
    })

    $scope.del = function(_id, index) {
      ApplicationAreaAdvantage.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.advantages.splice(index, 1);
      });
    }
  }])
  .controller('SaveApplicationAreaAdvantageCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'Product', 'ApplicationAreaAdvantage', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, Product, ApplicationAreaAdvantage, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
    var applicationAreaId = $stateParams.applicationAreaId,
      applicationAreaName = $stateParams.applicationAreaName;
    $scope.layoutModels = [{ _id: 0, name: '左文右图' }, { _id: 1, name: '上文下图' }, { _id: 2, name: '左图右文' }, { _id: 3, name: '上图下文' }];
    $scope.layout = 0;
    $scope.selectedProductIds = [];

    $scope.btn = '保存';
    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });
    if (!!applicationAreaId)
      Product.get({ category: 'application-area', _id: applicationAreaId }, function(result) {
        $scope.products = result.data;
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
      $scope.selectedProductIds = $scope.selectedProductIds.filter(Boolean);

      var advantage = { title: this.title, url: this.url, brief: this.brief, layout: this.layout, applicationAreaId: applicationAreaId, products: this.selectedProductIds };

      ApplicationAreaAdvantage.save({}, { advantage: advantage }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('applicationAreaAdvantages', { applicationAreaId: applicationAreaId, applicationAreaName: applicationAreaName });
      });

    }
  }])
  .controller('UpdateApplicationAreaAdvantageCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'Product', 'ApplicationAreaAdvantage', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, Product, ApplicationAreaAdvantage, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
    var applicationAreaId = $stateParams.applicationAreaId,
      applicationAreaName = $stateParams.applicationAreaName,
      _id = $stateParams._id;
    $scope.layoutModels = [{ _id: 0, name: '左文右图' }, { _id: 1, name: '上文下图' }, { _id: 2, name: '左图右文' }, { _id: 3, name: '上图下文' }];
    $scope.layout = 0;
    $scope.selectedProductIds = [];

    $scope.btn = '保存';
    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });
    if (!!applicationAreaId)
      Product.get({ category: 'application-area', _id: applicationAreaId }, function(result) {
        $scope.products = result.data;
        ApplicationAreaAdvantage.get({ _id: _id }, function(result) {
          var relatedProductIds = result.data.products;
          var idx = 0;
          for (idx in $scope.products)
            if (relatedProductIds.indexOf($scope.products[idx]._id) > -1)
              $scope.selectedProductIds.push($scope.products[idx]._id);
            else
              $scope.selectedProductIds.push('');

          $scope.title = result.data.title;
          $scope.brief = result.data.brief;
          $scope.url = result.data.url;
          $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + result.data.url;
          $scope.layout = result.data.layout;

        });
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

    $scope.update = function() {
      $scope.selectedProductIds = $scope.selectedProductIds.filter(Boolean);

      var advantage = { title: this.title, url: this.url, brief: this.brief, layout: this.layout, applicationAreaId: applicationAreaId, products: this.selectedProductIds };

      ApplicationAreaAdvantage.update({ _id: _id }, { advantage: advantage }, function(result) {
        toaster.clear();
        toaster.success('成功', '修改成功！');
        $state.go('applicationAreaAdvantages', { applicationAreaId: applicationAreaId, applicationAreaName: applicationAreaName });
      });

    }
  }]);
