'use strict';

/**
 * @ngdoc overview
 * @name bdMpManagementApp
 * @description
 * # bdMpManagementApp
 *
 * Main module of the application.
 */
var BDMpManagementApp = angular
  .module('bdMpManagementApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'LocalStorageModule',
    'angular-loading-bar',
    'toaster',
    'ngFileUpload',
    'summernote',
    'angular-labelauty',
    'ngDraggable',
  ]);

BDMpManagementApp.constant('BD_API', '/api');
BDMpManagementApp.constant('QINIU_DOWNLOAD_DOMAIN', 'http://cdn1.ccf-china.com/');
BDMpManagementApp.constant('QINIU_UPLOAD_DOMAIN', 'http://upload-na0.qiniu.com/');

BDMpManagementApp.run(['$state', '$rootScope', 'localStorageService', 'toaster', function($state, $rootScope, localStorageService, toaster) {
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.pageTitle = toState.pageTitle;
  });
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (toState.name === 'signin') {
      return;
    }
    if (!angular.isObject(localStorageService.get('user'))) {
      event.preventDefault();

      toaster.clear();
      toaster.error('失败', '登录失效，请重新登录！');
      $state.go('signin');
    }
  });
}]);

// router configration
BDMpManagementApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
  }])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('santel');
  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('BdAuthorityInterceptor');
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/signin');
    $stateProvider
      .state('signin', {
        pageTitle: '登录',
        url: '/signin',
        views: {
          '': {
            templateUrl: 'views/auth/signin.html'
          },
        }
      })
      .state('signinWithRedirect', {
        url: '/signin/:redirect',
        views: {
          '': {
            templateUrl: 'views/auth/signin.html'
          },
        }
      })
      .state('dashboard', {
        pageTitle: '管理控制台',
        url: '/dashboard',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@dashboard': {
            templateUrl: 'views/dashboard/dashboard.html'
          }
        }
      })
      // authority
      .state('administrator', {
        pageTitle: '管理员账户',
        url: '/administrator',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@administrator': {
            templateUrl: 'views/authority/administrator.html'
          }
        }
      })
      .state('addAdministrator', {
        pageTitle: '添加管理员',
        url: '/administrator/add',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@addAdministrator': {
            templateUrl: 'views/authority/add.html'
          }
        }
      })
      .state('modifyAdministrator', {
        pageTitle: '修改管理员',
        url: '/administrator/modify/:username',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@modifyAdministrator': {
            templateUrl: 'views/authority/modify.html'
          }
        }
      })
      .state('resetPassword', {
        pageTitle: '重置密码',
        url: '/administrator/reset-password/:username',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@resetPassword': {
            templateUrl: 'views/authority/reset-password.html'
          }
        }
      })
      // company
      //    contact
      .state('contact', {
        pageTitle: '公司本部',
        url: '/company/contact',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@contact': {
            templateUrl: 'views/company/contact/index.html'
          }
        }
      })
      .state('distributor', {
        pageTitle: '公司分部',
        url: '/company/contact/distributor',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@distributor': {
            templateUrl: 'views/company/contact/distributor.html'
          }
        }
      })
      .state('saveDistributor', {
        pageTitle: '保存分部',
        url: '/company/contact/distributor/save/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveDistributor': {
            templateUrl: 'views/company/contact/save-distributor.html'
          }
        }
      })
      // profile
      .state('brief', {
        pageTitle: '公司简介',
        url: '/company/brief',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@brief': {
            templateUrl: 'views/company/brief/index.html'
          }
        }
      })
      // important dates
      .state('important-date', {
        pageTitle: '公司价值观',
        url: '/company/important-date',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@important-date': {
            templateUrl: 'views/company/important-date/index.html'
          }
        }
      })
      .state('addImportantDate', {
        pageTitle: '新增公司价值观',
        url: '/company/important-date/add',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@addImportantDate': {
            templateUrl: 'views/company/important-date/add.html'
          }
        }
      })
      // values
      .state('values', {
        pageTitle: '公司资质',
        url: '/company/values',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@values': {
            templateUrl: 'views/company/values/index.html'
          }
        }
      })
      .state('saveValues', {
        pageTitle: '保存资质',
        url: '/company/values/save/:index',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveValues': {
            templateUrl: 'views/company/values/save.html'
          }
        }
      })
      .state('news', {
        pageTitle: '公司新闻',
        url: '/company/news/:page',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@news': {
            templateUrl: 'views/company/news/index.html'
          }
        }
      })
      .state('saveNews', {
        pageTitle: '保存新闻',
        url: '/company/news/save/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveNews': {
            templateUrl: 'views/company/news/save.html'
          }
        }
      })
      .state('whitePapers', {
        pageTitle: '白皮书',
        url: '/support/white-papers',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@whitePapers': {
            templateUrl: 'views/support/white-paper/index.html'
          }
        }
      })
      .state('saveWhitePaper', {
        pageTitle: '保存白皮书',
        url: '/support/white-papers/save/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveWhitePaper': {
            templateUrl: 'views/support/white-paper/save.html'
          }
        }
      })
      .state('applications', {
        pageTitle: '白皮书',
        url: '/support/applications',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@applications': {
            templateUrl: 'views/support/download/index.html'
          }
        }
      })
      .state('saveApplication', {
        pageTitle: '保存白皮书',
        url: '/support/applications/save/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveApplication': {
            templateUrl: 'views/support/download/save.html'
          }
        }
      })
      .state('faqCategory', {
        pageTitle: '常见问题分类',
        url: '/support/faq-category',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@faqCategory': {
            templateUrl: 'views/support/faq/category/index.html'
          }
        }
      })
      .state('saveFaqCategory', {
        pageTitle: '新增常见问题分类',
        url: '/support/faq-category/save',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveFaqCategory': {
            templateUrl: 'views/support/faq/category/save.html'
          }
        }
      })
      .state('updateFaqCategory', {
        pageTitle: '修改常见问题分类',
        url: '/support/faq-category/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateFaqCategory': {
            templateUrl: 'views/support/faq/category/update.html'
          }
        }
      })
      .state('faqs', {
        pageTitle: '常见问题',
        url: '/support/faqs',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@faqs': {
            templateUrl: 'views/support/faq/list/index.html'
          }
        }
      })
      .state('saveFaq', {
        pageTitle: '保存常见问题',
        url: '/support/faqs/save',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveFaq': {
            templateUrl: 'views/support/faq/list/save.html'
          }
        }
      })
      .state('updateFaq', {
        pageTitle: '保存常见问题',
        url: '/support/faqs/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateFaq': {
            templateUrl: 'views/support/faq/list/update.html'
          }
        }
      })
      .state('bigEventCategory', {
        pageTitle: '重大事件分类',
        url: '/support/big-event-category',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@bigEventCategory': {
            templateUrl: 'views/support/big-event/category/index.html'
          }
        }
      })
      .state('saveBigEventCategory', {
        pageTitle: '新增重大事件分类',
        url: '/support/big-event-category/save',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveBigEventCategory': {
            templateUrl: 'views/support/big-event/category/save.html'
          }
        }
      })
      .state('updateBigEventCategory', {
        pageTitle: '修改重大事件分类',
        url: '/support/big-event-category/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateBigEventCategory': {
            templateUrl: 'views/support/big-event/category/update.html'
          }
        }
      })
      .state('bigEvents', {
        pageTitle: '重大事件',
        url: '/support/big-events',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@bigEvents': {
            templateUrl: 'views/support/big-event/list/index.html'
          }
        }
      })
      .state('saveBigEvent', {
        pageTitle: '保存重大事件',
        url: '/support/big-events/save',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveBigEvent': {
            templateUrl: 'views/support/big-event/list/save.html'
          }
        }
      })
      .state('updateBigEvent', {
        pageTitle: '保存重大事件',
        url: '/support/big-events/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateBigEvent': {
            templateUrl: 'views/support/big-event/list/update.html'
          }
        }
      })
      .state('productCategory', {
        pageTitle: '产品分类-应用领域',
        url: '/product/application-area/:applicationAreaId/productCategory',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@productCategory': {
            templateUrl: 'views/product/application-area/product-category.html'
          }
        }
      })
      .state('updateProductCategory', {
        pageTitle: '修改产品分类-应用领域',
        url: '/product/application-area/:applicationAreaId/productCategory/:index/:name',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateProductCategory': {
            templateUrl: 'views/product/application-area/product-category-update.html'
          }
        }
      })
      .state('applicationAreas', {
        pageTitle: '应用领域',
        url: '/product/application-areas',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@applicationAreas': {
            templateUrl: 'views/product/application-area/index.html'
          }
        }
      })
      .state('saveApplicationArea', {
        pageTitle: '添加应用领域',
        url: '/product/application-area/save',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveApplicationArea': {
            templateUrl: 'views/product/application-area/save.html'
          }
        }
      })
      .state('updateApplicationArea', {
        pageTitle: '修改应用领域',
        url: '/product/application-area/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateApplicationArea': {
            templateUrl: 'views/product/application-area/save.html'
          }
        }
      })
      .state('products', {
        pageTitle: '产品列表',
        url: '/products/:applicationAreaId/:productCategoryId',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@products': {
            templateUrl: 'views/product/list/index.html'
          }
        }
      })
      .state('saveProduct', {
        pageTitle: '添加产品基本信息',
        url: '/product/save',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveProduct': {
            templateUrl: 'views/product/list/save.html'
          }
        }
      })
      .state('updateProduct', {
        pageTitle: '修改产品基本信息',
        url: '/product/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateProduct': {
            templateUrl: 'views/product/list/save.html'
          }
        }
      })
      .state('techSpecs', {
        pageTitle: '产品技术规格',
        url: '/product/tech-specs/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@techSpecs': {
            templateUrl: 'views/product/list/tech-specs.html'
          }
        }
      })
      .state('saveTechSpec', {
        pageTitle: '添加产品技术规格',
        url: '/product/tech-spec/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveTechSpec': {
            templateUrl: 'views/product/list/save-tech-spec.html'
          }
        }
      })
      .state('updateTechSpec', {
        pageTitle: '修改产品技术规格',
        url: '/product/tech-spec/:_id/:index',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateTechSpec': {
            templateUrl: 'views/product/list/save-tech-spec.html'
          }
        }
      })
      .state('saveProductAdvantage', {
        pageTitle: '添加产品卖点',
        url: '/product/advantage/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveProductAdvantage': {
            templateUrl: 'views/product/list/save-advantage.html'
          }
        }
      })
      .state('updateProductAdvantage', {
        pageTitle: '修改产品卖点',
        url: '/product/advantage/:_id/:index',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateProductAdvantage': {
            templateUrl: 'views/product/list/save-advantage.html'
          }
        }
      })
      .state('productAdvantages', {
        pageTitle: '产品卖点列表',
        url: '/product/advantages/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@productAdvantages': {
            templateUrl: 'views/product/list/advantage-list.html'
          }
        }
      })
      .state('solutions', {
        pageTitle: '解决方案列表',
        url: '/solutions/:applicationAreaId',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@solutions': {
            templateUrl: 'views/solution/list/index.html'
          }
        }
      })
      .state('saveSolution', {
        pageTitle: '添加解决方案基本信息',
        url: '/solution/save',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveSolution': {
            templateUrl: 'views/solution/list/save.html'
          }
        }
      })
      .state('updateSolution', {
        pageTitle: '修改解决方案基本信息',
        url: '/solution/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateSolution': {
            templateUrl: 'views/solution/list/save.html'
          }
        }
      })
      .state('solutionTechSpecs', {
        pageTitle: '解决方案技术规格',
        url: '/solution/tech-specs/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@solutionTechSpecs': {
            templateUrl: 'views/solution/list/tech-specs.html'
          }
        }
      })
      .state('saveSolutionTechSpec', {
        pageTitle: '添加解决方案技术规格',
        url: '/solution/tech-spec/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveSolutionTechSpec': {
            templateUrl: 'views/solution/list/save-tech-spec.html'
          }
        }
      })
      .state('updateSolutionTechSpec', {
        pageTitle: '修改解决方案技术规格',
        url: '/solution/tech-spec/:_id/:index',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateSolutionTechSpec': {
            templateUrl: 'views/solution/list/save-tech-spec.html'
          }
        }
      })
      .state('saveSolutionAdvantage', {
        pageTitle: '添加解决方案卖点',
        url: '/solution/advantage/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveSolutionAdvantage': {
            templateUrl: 'views/solution/list/save-advantage.html'
          }
        }
      })
      .state('updateSolutionAdvantage', {
        pageTitle: '修改解决方案卖点',
        url: '/solution/advantage/:_id/:index',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateSolutionAdvantage': {
            templateUrl: 'views/solution/list/save-advantage.html'
          }
        }
      })
      .state('solutionAdvantages', {
        pageTitle: '解决方案卖点列表',
        url: '/solution/advantages/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@solutionAdvantages': {
            templateUrl: 'views/solution/list/advantage-list.html'
          }
        }
      })
      .state('applicationAreaAdvantages', {
        pageTitle: '应用领域优势',
        url: '/product/application-area/advantages/:applicationAreaId/:applicationAreaName',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@applicationAreaAdvantages': {
            templateUrl: 'views/product/application-area/application-area-advantages.html'
          }
        }
      })
      .state('saveApplicationAreaAdvantage', {
        pageTitle: '添加领域优势',
        url: '/product/application-area/advantage/:applicationAreaId/:applicationAreaName',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveApplicationAreaAdvantage': {
            templateUrl: 'views/product/application-area/save-application-area-advantage.html'
          }
        }
      })
      .state('updateApplicationAreaAdvantage', {
        pageTitle: '修改领域优势',
        url: '/product/application-area/advantage/update/:_id/:applicationAreaId/:applicationAreaName',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateApplicationAreaAdvantage': {
            templateUrl: 'views/product/application-area/update-application-area-advantage.html'
          }
        }
      })
      // index-page
      .state('banner', {
        pageTitle: '首页轮播图管理',
        url: '/banners',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@banner': {
            templateUrl: 'views/index-page/banner-management.html'
          }
        }
      })
      .state('saveBanner', {
        pageTitle: '添加轮播图',
        url: '/banner/add',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveBanner': {
            templateUrl: 'views/index-page/banner-save.html'
          }
        }
      })
      .state('updateBanner', {
        pageTitle: '修改轮播图',
        url: '/banner/modify/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateBanner': {
            templateUrl: 'views/index-page/banner-update.html'
          }
        }
      })
      .state('recommandedAA', {
        pageTitle: '应用领域首页推荐',
        url: '/recommanded-aas',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@recommandedAA': {
            templateUrl: 'views/index-page/application-area-recommanded.html'
          }
        }
      })
      .state('saveRecommandedAA', {
        pageTitle: '添加轮播图',
        url: '/recommanded-aa/add',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveRecommandedAA': {
            templateUrl: 'views/index-page/recommanded-save.html'
          }
        }
      })
      .state('updateRecommandedAA', {
        pageTitle: '修改轮播图',
        url: '/recommanded-aa/modify/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateRecommandedAA': {
            templateUrl: 'views/index-page/recommanded-update.html'
          }
        }
      })
      .state('saveFriendLink', {
        pageTitle: '添加友情链接',
        url: '/company/friend-links/add',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveFriendLink': {
            templateUrl: 'views/company/friend-link/add.html'
          }
        }
      })
      .state('friendLinks', {
        pageTitle: '友情链接',
        url: '/company/friend-links/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@friendLinks': {
            templateUrl: 'views/company/friend-link/index.html'
          }
        }
      })
      .state('updateFriendLink', {
        pageTitle: '添加友情链接',
        url: '/company/friend-links/update/:_id/:index',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateFriendLink': {
            templateUrl: 'views/company/friend-link/update.html'
          }
        }
      })
      .state('friendLinkCategory', {
        pageTitle: '友情链接分类',
        url: '/company/friend-link/category',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@friendLinkCategory': {
            templateUrl: 'views/company/friend-link/friend-link-category.html'
          }
        }
      })
      .state('saveFriendLinkCategory', {
        pageTitle: '添加友情链接分类',
        url: '/company/friend-link/category/add',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveFriendLinkCategory': {
            templateUrl: 'views/company/friend-link/add-friend-link-category.html'
          }
        }
      })
      .state('updateFriendLinkCategory', {
        pageTitle: '修改友情链接分类',
        url: '/company/friend-link/category/update/:_id',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@updateFriendLinkCategory': {
            templateUrl: 'views/company/friend-link/update-friend-link-category.html'
          }
        }
      })
      .state('saveWebsiteSetting', {
        pageTitle: '修改网站栏目名称',
        url: '/website/setting',
        views: {
          '': {
            templateUrl: 'views/main.html'
          },
          'bd-content@saveWebsiteSetting': {
            templateUrl: 'views/website/setting.html'
          }
        }
      });
  }]);
