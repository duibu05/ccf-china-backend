BDMpManagementApp
  .controller('SaveWebsiteSettingCtrl', ['$scope', '$state', 'WebsiteSetting', 'toaster', function($scope, $state, WebsiteSetting, toaster) {
    var setting;
    WebsiteSetting.get({}, function(result) {
      if (!!result) {
        setting = angular.fromJson(result.data.content);
        $scope.home = setting.INDEX.TITLE;
        $scope.relatedProduct = setting.APPLICATION_AREA.EXPLORE_RELATIONAL;
        $scope.techSpecs = setting.PRODUCT.TECH_SPECS;
        $scope.where2Buy = setting.PRODUCT.WHERE_TO_BUY;
        $scope.support = setting.SUPPORT.TITLE;
        $scope.supportSlogn = setting.SUPPORT.SLOGN;
        $scope.santelInfo = setting.COMPANY.TITLE;
        $scope.santelCert = setting.COMPANY.VALUES;
        $scope.santelValue = setting.COMPANY.IMPORTANT_DATE;
        $scope.bigEvent = setting.COMPANY.BIG_EVENTS;
        $scope.contactUs = setting.CONTACT.TITLE;
        $scope.headOffice = setting.CONTACT.HEAD_OFFICE;
        $scope.distributor = setting.CONTACT.DISTRIBUTOR;
        $scope.learnMore = setting.COMMON.LEARN_MORE;
        $scope.support = setting.COMMON.SUPPORT;
        $scope.product = setting.COMMON.PRODUCTS;
        $scope.solution = setting.COMMON.SOLUTIONS;
        $scope.applicationArea = setting.COMMON.APPLICATION_AREA;
        $scope.faqs = setting.COMMON.FAQS;
        $scope.company = setting.COMMON.COMPANY;
        $scope.santelInfo = setting.COMMON.SANTEL_INFO;
        $scope.newsCenter = setting.COMMON.NEWS_CENTER;
        $scope.contactUs = setting.COMMON.CONTACT_SANTEL;
        $scope.friendLink = setting.COMMON.FRIEND_LINKS;
        $scope.lang = setting.COMMON.LANG;
        $scope.whitePaper = setting.COMMON.WHITE_PAPER;
        $scope.download = setting.COMMON.APPLICATION;
        $scope.auth = setting.COMMON.AUTH;
      }
    })

    $scope.save = function() {
      setting = {
        INDEX: { TITLE: $scope.home },
        APPLICATION_AREA: { EXPLORE_RELATIONAL: $scope.relatedProduct },
        PRODUCT: { TECH_SPECS: $scope.techSpecs, WHERE_TO_BUY: $scope.where2Buy },
        SUPPORT: { TITLE: $scope.support, SLOGN: $scope.supportSlogn },
        COMPANY: { TITLE: $scope.santelInfo, VALUES: $scope.santelCert, IMPORTANT_DATE: $scope.santelValue, BIG_EVENTS: $scope.bigEvent },
        CONTACT: { TITLE: $scope.contactUs, HEAD_OFFICE: $scope.headOffice, DISTRIBUTOR: $scope.distributor },
        COMMON: { LEARN_MORE: $scope.learnMore, SUPPORT: $scope.support, PRODUCTS: $scope.product, SOLUTIONS: $scope.solution, APPLICATION_AREA: $scope.applicationArea, FAQS: $scope.faqs, COMPANY: $scope.company, SANTEL_INFO: $scope.santelInfo, NEWS_CENTER: $scope.newsCenter, CONTACT_SANTEL: $scope.contactUs, FRIEND_LINKS: $scope.friendLink, LANG: $scope.lang, WHITE_PAPER: $scope.whitePaper, APPLICATION: $scope.download, AUTH: $scope.auth }
      };
      WebsiteSetting.save({}, { content: angular.toJson(setting, false) }, function(result) {
        toaster.clear();
        toaster.success('成功！', '保存成功');
      });
    };
  }])
  .controller('BigEventCategoryCtrl', ['$scope', '$state', 'BigEventCategory', 'toaster', function($scope, $state, BigEventCategory, toaster) {
    BigEventCategory.get({}, function(result) {
      if (result && result.data) {
        $scope.bigEventCategories = result.data;
      }
    });

    $scope.delBigEventCategory = function(_id, index) {
      BigEventCategory.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.bigEventCategories.splice(index, 1);
      });
    }
  }])
  .controller('SaveBigEventCategoryCtrl', ['$scope', '$state', '$stateParams', 'BigEventCategory', 'toaster', function($scope, $state, $stateParams, BigEventCategory, toaster) {

    $scope.identifyBigEventCategoryData = function() {
      $scope.bigEventCategories = [];
      var data = this.bigEventCategoryData;
      var bigEventCategoryArray = data.split("\n");
      bigEventCategoryArray = bigEventCategoryArray.filter(Boolean);

      for (var i = 0; i < bigEventCategoryArray.length; i++) {
        $scope.bigEventCategories.push({ title: bigEventCategoryArray[i] });
      }
    }

    $scope.confirmAndSubmit = function() {
      var bigEventCategories = $scope.bigEventCategories;
      BigEventCategory.save({}, { bigEventCategories: bigEventCategories }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('bigEventCategory');
      });
    }
  }])
  .controller('UpdateBigEventCategoryCtrl', ['$scope', '$state', '$stateParams', 'BigEventCategory', 'toaster', function($scope, $state, $stateParams, BigEventCategory, toaster) {
    var _id = $stateParams._id;
    BigEventCategory.get({ _id: _id }, function(result) {
      if (result && result.data) {
        $scope.title = result.data.title;
      }
    });

    $scope.update = function() {
      BigEventCategory.update({ _id: _id, bigEventCategory: { _id: _id, title: this.title } }, function(result) {
        toaster.clear();
        toaster.success('成功！', '修改成功');
        $state.go('bigEventCategory');
      });
    }
  }])
  .controller('BigEventCtrl', ['$scope', '$state', 'BigEvent', 'toaster', function($scope, $state, BigEvent, toaster) {
    BigEvent.get({}, function(result) {
      if (result && result.data) {
        $scope.bigEvents = result.data;
      }
    });

    $scope.delBigEvent = function(_id, index) {
      BigEvent.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.bigEvents.splice(index, 1);
      });
    }
  }])
  .controller('MutiSaveBigEventCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', 'BigEvent', 'BigEventCategory', 'toaster', function($scope, $state, $stateParams, Upload, BdQiniu, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN, BigEvent, BigEventCategory, toaster) {
    BigEventCategory.get({}, function(result) {
      if (!!result && result.data.length === 0) {
        alert('请先添加常见问题分类！');
        $state.go('bigEventCategory');
      }
      $scope.categories = result.data;
      $scope.category = result.data[0]._id;
    });
    $scope.identifyBigEventData = function() {
      $scope.bigEvents = [];
      $scope.bigEventValid = true;
      var data = this.bigEventData;
      var bigEventArray = data.split("\n");
      bigEventArray = bigEventArray.filter(Boolean);

      if (bigEventArray.length % 2 !== 0) {
        alert('数据不完整，请仔细检查')
        $scope.bigEventValid = false;
      }
      for (var i = 0; i < bigEventArray.length; i = i + 2) {
        var bigEvent = { question: bigEventArray[i].trim(), answer: bigEventArray[i + 1].trim(), category: $scope.category };
        if (!bigEvent.question || !bigEvent.answer) {
          $scope.bigEventValid = false;
          bigEvent.invalid = true;
        } else {
          bigEvent.invalid = false;
        }
        $scope.bigEvents.push(bigEvent);
      }
    }

    $scope.confirmAndSubmit = function() {
      var bigEvents = $scope.bigEvents;
      BigEvent.save({}, { bigEvents: bigEvents }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('bigEvents');
      });
    }
  }])
  .controller('SaveBigEventCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', 'BigEvent', 'BigEventCategory', 'toaster', function($scope, $state, $stateParams, Upload, BdQiniu, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN, BigEvent, BigEventCategory, toaster) {

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

    BigEventCategory.get({}, function(result) {
      if (!!result && result.data.length === 0) {
        alert('请先添加常见问题分类！');
        $state.go('bigEventCategory');
      }
      $scope.categories = result.data;
      $scope.category = result.data[0]._id;
    });

    $scope.update = function() {
      var bigEvents = $scope.bigEvents;
      BigEvent.save({}, { bigEvents: [{ question: this.question, answer: this.answer, category: this.category }] }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('bigEvents');
      });
    }
  }])
  .controller('UpdateBigEventCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', 'BigEvent', 'BigEventCategory', 'toaster', function($scope, $state, $stateParams, Upload, BdQiniu, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN, BigEvent, BigEventCategory, toaster) {
    var _id = $stateParams._id;
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

    BigEventCategory.get({}, function(result) {
      if (!!result && result.data.length === 0) {
        alert('请先添加常见问题分类！');
        $state.go('bigEventCategory');
      }
      $scope.categories = result.data;
    });

    BigEvent.get({ _id: _id }, function(result) {
      if (result && result.data) {
        $scope.question = result.data.question;
        $scope.answer = result.data.answer;
        $scope.category = result.data.category;
      }
    });

    $scope.update = function() {
      BigEvent.update({ _id: _id, bigEvent: { _id: _id, question: this.question, answer: this.answer, category: this.category } }, function(result) {
        toaster.clear();
        toaster.success('成功！', '修改成功');
        $state.go('bigEvents');
      });
    }
  }]);
