BDMpManagementApp
  .controller('BriefCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'Company', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, Company, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
    $scope.btn = '保存';
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

    Company.get({ _id: '1' }, function(result) {
      if (result && result.data) {
        $scope.brief = result.data.brief;
        $scope.url = result.data.picture;
        $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + result.data.picture;
        $scope._id = result.data._id;
      }
    });

    $scope.updateBrief = function() {
      var company = { brief: this.brief, picture: this.url };
      Company.save({}, { company: company }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
      });
    }
  }])
  .controller('ImportantDateCtrl', ['$scope', '$state', 'Company', 'toaster', function($scope, $state, Company, toaster) {
    Company.get({ _id: '1' }, function(result) {
      if (result && result.data) {
        $scope.company = result.data;
      }
    });

    $scope.delImportantDate = function(index) {
      Company.delete({ _id: 1, subModel: 'important-date', index: index }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.company.importantDates.splice(index, 1);
      });
    }
  }])
  .controller('SaveImportantDateCtrl', ['$scope', '$state', '$stateParams', 'Company', 'toaster', 'BdStringUtils', function($scope, $state, $stateParams, Company, toaster, BdStringUtils) {

    $scope.identifyEventData = function() {
      $scope.events = [];
      $scope.eventValid = true;
      var data = this.eventData;
      var eventArray = data.split("\n");
      eventArray = eventArray.filter(Boolean);

      if (eventArray.length % 2 !== 0) {
        alert('数据不完整，请仔细检查')
        $scope.eventValid = false;
      }
      for (var i = 0; i < eventArray.length; i = i + 2) {
        var event = { event: eventArray[i + 1].trim(), date: eventArray[i].trim() };
        if (!event.event || !event.date) {
          $scope.eventValid = false;
          event.invalid = true;
        } else {
          event.invalid = false;
        }
        $scope.events.push(event);
      }
    }

    $scope.confirmAndSubmit = function() {
      var company = { importantDates: $scope.events };
      Company.save({}, { company: company }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('important-date');
      });
    }
  }])
  .controller('ValuesCtrl', ['$scope', '$state', 'Company', 'toaster', function($scope, $state, Company, toaster) {
    Company.get({ _id: '1' }, function(result) {
      if (result && result.data) {
        $scope.company = result.data;
      }
    });

    $scope.delValues = function(index) {
      Company.delete({ _id: 1, subModel: 'values', index: index }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.company.values.splice(index, 1);
      });
    }
  }])
  .controller('SaveValuesCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'Company', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', function($scope, $state, $stateParams, Upload, BdQiniu, Company, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN) {
    var index = $stateParams.index;
    $scope.action = !!$stateParams.index ? '修改' : '新增';
    $scope.btn = '保存';
    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });
    if (!!index)
      Company.get({ _id: '1' }, function(result) {
        if (result && result.data) {
          $scope.title = result.data.values[index].title;
          $scope.url = result.data.values[index].url.substr(result.data.values[index].url.lastIndexOf('/'));
          $scope.brief = result.data.values[index].brief;
          $scope.previewUrl = result.data.values[index].url;
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
      var company = { values: [{ title: this.title, url: this.url, brief: this.brief }], index: index };
      Company.save({}, { company: company }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('values');
      });
    }
  }])
  .controller('NewsCtrl', ['$scope', '$state', '$stateParams', 'News', 'toaster', function($scope, $state, $stateParams, News, toaster) {
    var page = $stateParams.page || 1,
      pageSize = 1;

    News.get({}, function(result) {
      if (result && result.data) {
        $scope.newsList = result.data;
      }
    });

    $scope.delNews = function(id, index) {
      News.delete({ _id: id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.newsList.splice(index, 1);
      });
    }
  }])
  .controller('SaveNewsCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'News', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', 'localStorageService', function($scope, $state, $stateParams, Upload, BdQiniu, News, toaster, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN, localStorageService) {
    var _id = $stateParams._id;
    $scope.action = !!_id ? '修改' : '发布';

    if (!!_id)
      News.get({ _id: _id }, function(result) {
        if (result && result.data) {
          $scope.title = result.data.title;
          $scope.content = result.data.content;
        }
      });

    $scope.summernoteOptions = {
      height: 300,
    }

    $scope.imageUpload = function(files) {
      var uploadFile = function(file) {
        BdQiniu.getUpToken().then(function(res) {
          if (res.status === 200 && !!res.data.token) {
            Upload.upload({
              url: QINIU_UPLOAD_DOMAIN,
              data: {
                token: res.data.token,
                file: file
              }
            }).then(function(resp) {
              if (resp.status === 200) {
                var url = QINIU_DOWNLOAD_DOMAIN + resp.data.key;
                $scope.editor.summernote('insertImage', url, '');
                toaster.clear();
                toaster.success('成功', '上传成功！');
              } else {
                toaster.clear();
                toaster.error('失败', '上传失败，请重试！');
              }
            }, null, function(evt) {});
          }

        });
      }
      for (var i = 0; i < files.length; i++) {
        if (!!files) {
          uploadFile(files[i]);
        }
      }
    }

    $scope.save = function() {
      var news = { title: this.title, content: this.content };
      if (!!_id) {
        news._id = _id;
      }
      news.author = localStorageService.get('user').name;
      News.save({}, { news: news }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('news');
      });
    }
  }])
  .controller('FriendLinkCtrl', ['$scope', '$state', '$stateParams', 'FriendLinkCategory', 'toaster', function($scope, $state, $stateParams, FriendLinkCategory, toaster) {
    var _id = $stateParams._id;

    FriendLinkCategory.get({}, function(result) {
      if (result && result.data) {
        $scope.friendLinkCategories = result.data;
        if (!_id) {
          $scope.friendLinkCategory = result.data[0]._id;
          $scope.category = result.data[0];
        } else {
          $scope.friendLinkCategory = _id;
          for (var i in result.data)
            if (_id === result.data[i]._id)
              $scope.category = result.data[i];
        }
      }
    });

    $scope.$watch('friendLinkCategory', function() {
      if ($scope.friendLinkCategory)
        $state.go('friendLinks', { _id: $scope.friendLinkCategory });
    })

    $scope.del = function(_id, index) {
      FriendLinkCategory.delete({ _id: _id, index: index }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.category.links.splice(index, 1);
      });
    }
  }])
  .controller('FriendLinkCategoryCtrl', ['$scope', '$state', 'FriendLinkCategory', 'toaster', function($scope, $state, FriendLinkCategory, toaster) {
    FriendLinkCategory.get({}, function(result) {
      if (result && result.data) {
        $scope.friendLinkCategories = result.data;
      }
    });

    $scope.del = function(_id, index) {
      FriendLinkCategory.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.friendLinkCategories.splice(index, 1);
      });
    }
  }])
  .controller('SaveFriendLinkCategoryCtrl', ['$scope', '$state', 'FriendLinkCategory', 'toaster', function($scope, $state, FriendLinkCategory, toaster) {
    $scope.identifyFriendLinkCategoryData = function() {
      $scope.friendLinkCategories = [];

      var data = this.friendLinkCategoryData;
      var friendLinkCategoryArray = data.split("\n");
      friendLinkCategoryArray = friendLinkCategoryArray.filter(Boolean);

      for (var i = 0; i < friendLinkCategoryArray.length; i++)
        $scope.friendLinkCategories.push({ title: friendLinkCategoryArray[i] });
    }

    $scope.confirmAndSubmit = function() {
      FriendLinkCategory.save({}, { friendLinkCategories: $scope.friendLinkCategories }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('friendLinkCategory');
      })
    }
  }])
  .controller('UpdateFriendLinkCategoryCtrl', ['$scope', '$state', '$stateParams', 'FriendLinkCategory', 'toaster', function($scope, $state, $stateParams, FriendLinkCategory, toaster) {
    var _id = $stateParams._id;
    if (_id)
      FriendLinkCategory.get({ _id: _id }, function(result) {
        $scope.title = result.data.title;
      })

    $scope.update = function() {
      FriendLinkCategory.update({ _id: _id }, { friendLinkCategory: { title: this.title } }, function(result) {
        toaster.clear();
        toaster.success('成功', '修改成功！');
        $state.go('friendLinkCategory');
      })
    }
  }])
  .controller('SaveFriendLinkCtrl', ['$scope', '$state', 'FriendLinkCategory', 'toaster', function($scope, $state, FriendLinkCategory, toaster) {
    FriendLinkCategory.get({}, function(result) {
      if (!!result && result.data.length === 0) {
        alert('请先添加友情链接分类！');
        $state.go('saveFriendLinkCategory');
      }
      $scope.categories = result.data;
      $scope.category = result.data[0]._id;
    });
    $scope.identifyFriendLinkData = function() {
      $scope.friendLinks = [];
      $scope.friendLinkValid = true;
      var data = this.friendLinkData;
      var friendLinkArray = data.split("\n");
      friendLinkArray = friendLinkArray.filter(Boolean);

      if (friendLinkArray.length % 2 !== 0) {
        alert('数据不完整，请仔细检查')
        $scope.friendLinkValid = false;
      }
      for (var i = 0; i < friendLinkArray.length; i = i + 2) {
        var friendLink = { name: (friendLinkArray[i] || '').trim(), url: (friendLinkArray[i + 1] || '').trim() };
        if (!friendLink.name || !friendLink.url) {
          $scope.friendLinkValid = false;
          friendLink.invalid = true;
        } else {
          friendLink.invalid = false;
        }
        $scope.friendLinks.push(friendLink);
      }
    }

    $scope.confirmAndSubmit = function() {
      var friendLinks = $scope.friendLinks;
      var _id = this.category;
      FriendLinkCategory.update({ _id: _id }, { friendLinkCategory: { links: friendLinks, _id: _id } }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('friendLinks', { _id: _id });
      });
    }
  }])
  .controller('UpdateFriendLinkCtrl', ['$scope', '$state', '$stateParams', 'FriendLinkCategory', 'toaster', function($scope, $state, $stateParams, FriendLinkCategory, toaster) {
    var _id = $stateParams._id;
    var index = $stateParams.index;
    FriendLinkCategory.get({}, function(result) {
      if (!!result && result.data.length === 0) {
        alert('请先添加友情链接分类！');
        $state.go('friendLinkCategory');
      }
      $scope.categories = result.data;
      $scope.category = _id;
      for (var i in $scope.categories)
        if (_id === $scope.categories[i]._id) {
          $scope.friendLinkCategory = $scope.categories[i];
          $scope.name = $scope.friendLinkCategory.links[index].name;
          $scope.url = $scope.friendLinkCategory.links[index].url;
        }
    });

    $scope.update = function() {
      FriendLinkCategory.update({ _id: _id, index: index }, { link: { name: this.name, url: this.url } }, function(result) {
        toaster.clear();
        toaster.success('成功！', '修改成功');
        $state.go('friendLinks', { _id: _id });
      });
    }
  }]);
