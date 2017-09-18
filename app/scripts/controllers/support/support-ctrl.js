BDMpManagementApp
  .controller('WhitePaperCtrl', ['$scope', '$state', 'WhitePaper', 'QINIU_DOWNLOAD_DOMAIN', 'toaster', function($scope, $state, WhitePaper, QINIU_DOWNLOAD_DOMAIN, toaster) {
    WhitePaper.get({}, function(result) {
      if (result && result.data) {
        $scope.whitePapers = result.data;
        $scope.qiniuDownloadDomain = QINIU_DOWNLOAD_DOMAIN;
      }
    });

    $scope.delWhitePaper = function(_id, index) {
      WhitePaper.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.whitePapers.splice(index, 1);
      });
    }
  }])
  .controller('SaveWhitePaperCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', 'WhitePaper', 'toaster', function($scope, $state, $stateParams, Upload, BdQiniu, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN, WhitePaper, toaster) {
    var _id = $stateParams._id;
    if (!!_id)
      WhitePaper.get({ _id: _id }, function(result) {
        if (result && result.data) {
          $scope.title = result.data.title;
          $scope.fileName = result.data.file.name;
          $scope.fileUrl = result.data.file.url;
        }
      });

    $scope.action = !!_id ? '修改' : '添加';
    $scope.btn = '保存';
    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });

    $scope.uploadFile = function(file) {
      if (!file.$error) {
        $scope.fileName = file.name;
        $scope.btn = '获取上传凭证...';
        BdQiniu.getUpToken().then(function(res) {
          if (res.status === 200 && !!res.data.token) {
            $scope.btn = '正在上传...';
            $scope.fileUrl = '';
            Upload.upload({
              url: QINIU_UPLOAD_DOMAIN,
              data: {
                token: res.data.token,
                file: file
              }
            }).then(function(resp) {
              if (resp.status === 200) {
                $scope.btn = '保存';
                $scope.fileUrl = resp.data.key;
                $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + resp.data.key;
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
    }

    $scope.save = function() {
      var whitePaper = { title: this.title, file: { name: this.fileName, url: this.fileUrl } };
      console.log(whitePaper);
      if (!!_id) {
        whitePaper._id = _id;
        WhitePaper.update({ _id: _id }, { whitePaper: whitePaper }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('whitePapers');
        });
      } else
        WhitePaper.save({}, { whitePaper: whitePaper }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('whitePapers');
        });
    }
  }])
  .controller('ApplicationCtrl', ['$scope', '$state', 'Application', 'toaster', 'QINIU_DOWNLOAD_DOMAIN', function($scope, $state, Application, toaster, QINIU_DOWNLOAD_DOMAIN) {
    Application.get({}, function(result) {
      if (result && result.data) {
        $scope.applications = result.data;
        $scope.qiniuDownloadDomain = QINIU_DOWNLOAD_DOMAIN;
      }
    });

    $scope.delApplication = function(_id, index) {
      Application.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.applications.splice(index, 1);
      });
    }
  }])
  .controller('SaveApplicationCtrl', ['$scope', '$state', '$stateParams', 'Upload', 'BdQiniu', 'QINIU_DOWNLOAD_DOMAIN', 'QINIU_UPLOAD_DOMAIN', 'Application', 'toaster', function($scope, $state, $stateParams, Upload, BdQiniu, QINIU_DOWNLOAD_DOMAIN, QINIU_UPLOAD_DOMAIN, Application, toaster) {
    var _id = $stateParams._id;
    if (!!_id)
      Application.get({ _id: _id }, function(result) {
        if (result && result.data) {
          $scope.title = result.data.title;
          $scope.fileName = result.data.file.name;
          $scope.fileUrl = result.data.file.url;
        }
      });

    $scope.action = !!_id ? '修改' : '添加';
    $scope.btn = '保存';
    $scope.$watch('file', function() {
      if (!!$scope.file) {
        $scope.uploadFile($scope.file);
      }
    });

    $scope.uploadFile = function(file) {
      if (!file.$error) {
        $scope.fileName = file.name;
        $scope.btn = '获取上传凭证...';
        BdQiniu.getUpToken().then(function(res) {
          if (res.status === 200 && !!res.data.token) {
            $scope.btn = '正在上传...';
            $scope.fileUrl = '';
            Upload.upload({
              url: QINIU_UPLOAD_DOMAIN,
              data: {
                token: res.data.token,
                file: file
              }
            }).then(function(resp) {
              if (resp.status === 200) {
                $scope.btn = '保存';
                $scope.fileUrl = resp.data.key;
                $scope.previewUrl = QINIU_DOWNLOAD_DOMAIN + resp.data.key;
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
    }

    $scope.save = function() {
      var application = { title: this.title, file: { name: this.fileName, url: this.fileUrl } };
      console.log(application);
      if (!!_id) {
        application._id = _id;
        Application.update({ _id: _id }, { application: application }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('applications');
        });
      } else
        Application.save({}, { application: application }, function(result) {
          toaster.clear();
          toaster.success('成功', '保存成功！');
          $state.go('applications');
        });
    }
  }])
  .controller('FaqCategoryCtrl', ['$scope', '$state', 'FaqCategory', 'toaster', function($scope, $state, FaqCategory, toaster) {
    FaqCategory.get({}, function(result) {
      if (result && result.data) {
        $scope.faqCategories = result.data;
      }
    });

    $scope.delFaqCategory = function(_id, index) {
      FaqCategory.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.faqCategories.splice(index, 1);
      });
    }
  }])
  .controller('SaveFaqCategoryCtrl', ['$scope', '$state', '$stateParams', 'FaqCategory', 'toaster', function($scope, $state, $stateParams, FaqCategory, toaster) {

    $scope.identifyFaqCategoryData = function() {
      $scope.faqCategories = [];
      var data = this.faqCategoryData;
      var faqCategoryArray = data.split("\n");
      faqCategoryArray = faqCategoryArray.filter(Boolean);

      for (var i = 0; i < faqCategoryArray.length; i++) {
        $scope.faqCategories.push({ title: faqCategoryArray[i] });
      }
    }

    $scope.confirmAndSubmit = function() {
      var faqCategories = $scope.faqCategories;
      FaqCategory.save({}, { faqCategories: faqCategories }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('faqCategory');
      });
    }
  }])
  .controller('UpdateFaqCategoryCtrl', ['$scope', '$state', '$stateParams', 'FaqCategory', 'toaster', function($scope, $state, $stateParams, FaqCategory, toaster) {
    var _id = $stateParams._id;
    FaqCategory.get({ _id: _id }, function(result) {
      if (result && result.data) {
        $scope.title = result.data.title;
      }
    });

    $scope.update = function() {
      FaqCategory.update({ _id: _id, faqCategory: { _id: _id, title: this.title } }, function(result) {
        toaster.clear();
        toaster.success('成功！', '修改成功');
        $state.go('faqCategory');
      });
    }
  }])
  .controller('FaqCtrl', ['$scope', '$state', 'Faq', 'toaster', function($scope, $state, Faq, toaster) {
    Faq.get({}, function(result) {
      if (result && result.data) {
        $scope.faqs = result.data;
      }
    });

    $scope.delFaq = function(_id, index) {
      Faq.delete({ _id: _id }, function(result) {
        toaster.clear();
        toaster.success('成功！', '删除成功');
        $scope.faqs.splice(index, 1);
      });
    }
  }])
  .controller('SaveFaqCtrl', ['$scope', '$state', '$stateParams', 'Faq', 'FaqCategory', 'toaster', function($scope, $state, $stateParams, Faq, FaqCategory, toaster) {
    FaqCategory.get({}, function(result) {
      if (!!result && result.data.length === 0) {
        alert('请先添加常见问题分类！');
        $state.go('faqCategory');
      }
      $scope.categories = result.data;
      $scope.category = result.data[0]._id;
    });
    $scope.identifyFaqData = function() {
      $scope.faqs = [];
      $scope.faqValid = true;
      var data = this.faqData;
      var faqArray = data.split("\n");
      faqArray = faqArray.filter(Boolean);

      if (faqArray.length % 2 !== 0) {
        alert('数据不完整，请仔细检查')
        $scope.faqValid = false;
      }
      for (var i = 0; i < faqArray.length; i = i + 2) {
        var faq = { question: faqArray[i].trim(), answer: faqArray[i + 1].trim(), category: $scope.category };
        if (!faq.question || !faq.answer) {
          $scope.faqValid = false;
          faq.invalid = true;
        } else {
          faq.invalid = false;
        }
        $scope.faqs.push(faq);
      }
    }

    $scope.confirmAndSubmit = function() {
      var faqs = $scope.faqs;
      Faq.save({}, { faqs: faqs }, function(result) {
        toaster.clear();
        toaster.success('成功', '保存成功！');
        $state.go('faqs');
      });
    }
  }])
  .controller('UpdateFaqCtrl', ['$scope', '$state', '$stateParams', 'Faq', 'FaqCategory', 'toaster', function($scope, $state, $stateParams, Faq, FaqCategory, toaster) {
    var _id = $stateParams._id;
    FaqCategory.get({}, function(result) {
      if (!!result && result.data.length === 0) {
        alert('请先添加常见问题分类！');
        $state.go('faqCategory');
      }
      $scope.categories = result.data;
    });

    Faq.get({ _id: _id }, function(result) {
      if (result && result.data) {
        $scope.question = result.data.question;
        $scope.answer = result.data.answer;
        $scope.category = result.data.category;
      }
    });

    $scope.update = function() {
      Faq.update({ _id: _id, faq: { _id: _id, question: this.question, answer: this.answer, category: this.category } }, function(result) {
        toaster.clear();
        toaster.success('成功！', '修改成功');
        $state.go('faqs');
      });
    }
  }]);
