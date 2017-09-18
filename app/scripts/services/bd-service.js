'use strict';
// BDMpManagementApp.factory('QiniuService', function($resource, BD_API) {
//   return {
//     uptoken: $resource(BD_API + '/qiniu-uptoken/:fileExtName', { fileExtName: '@fileExtName' })
//   }
// });
BDMpManagementApp.factory('Administrator', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/user/:username', { username: '@username' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Contact', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/contact/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('WebsiteSetting', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/website-setting/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('WhitePaper', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/white-paper/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Application', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/application/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('FaqCategory', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/faq-category/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Faq', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/faq/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('BigEventCategory', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/big-event-category/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('BigEvent', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/big-event/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('FriendLinkCategory', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/friend-link-category/:_id/:index', { _id: '@_id', index: '@index' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('ApplicationArea', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/application-area/:_id/:categoryIndex', { _id: '@_id', categoryIndex: '@categoryIndex' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('ApplicationAreaAdvantage', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/application-area-advantage/:queryCondition/:_id', { _id: '@_id', queryCondition: '@queryCondition' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Product', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/product/:category/:advantage/:_id/:index', { category: '@category', advantage: '@advantage', _id: '@_id', index: '@index' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Solution', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/solution/:category/:advantage/:_id/:index', { category: '@category', advantage: '@advantage', _id: '@_id', index: '@index' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Company', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/company/:_id/:subModel/:index', { _id: '@_id', subModel: '@subModel', index: '@index' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('News', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/news/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Banner', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/banner/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('RecommandedAA', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/recommanded-aa/:_id', { _id: '@_id' }, { 'query': { method: 'GET' }, 'update': { method: 'PUT' } });
  }])
  .factory('Password', ['$resource', 'BD_API', function($resource, BD_API) {
    return $resource(BD_API + '/user/:username/password', { username: '@username' }, { 'update': { method: 'PUT' } });
  }])
  .factory('BdAuthority', ['$http', 'BD_API', function($http, BD_API) {
    return {
      signin: function(user) {
        return $http.post(BD_API + '/signin', user);
      },
      signout: function() {
        return $http.get(BD_API + '/signout');
      }
    }
  }])
  .factory('BdQiniu', ['$http', 'BD_API', function($http, BD_API) {
    return {
      getUpToken: function() {
        return $http.get(BD_API + '/qiniu-uptoken');
      },
    }
  }])
  .factory('BdStringUtils', function() {
    return {
      isDateStr: function(str) {
        var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) return false;

        return true;
      }
    }
  })
  .factory('BdAuthorityInterceptor', ['localStorageService', 'BD_API', 'toaster', '$injector', '$q', function(localStorageService, BD_API, toaster, $injector, $q) {
    return {
      request: function(config) {
        config.timeout = 5000;
        if (config.url.indexOf(BD_API) > -1 && config.url.indexOf('signin') === -1) {
          if (!angular.isObject(localStorageService.get('user'))) {
            toaster.clear();
            toaster.error('失败', '登录失效，请重新登录！');
            $injector.get('$state').go('signin');
          }
        } else if (config.url.indexOf('qiniu') !== -1)
          config.timeout = 200000;
        return config;
      },
      requestError: function(rejection) {
        console.log('requestError');
        console.log(rejection);
        return $q.reject(rejection);
      },
      response: function(response) {
        if (response.data.code === 2003) {
          localStorageService.set('user', '');
          toaster.clear();
          toaster.error('失败', '登录失效，请重新登录！');
          $injector.get('$state').go('signin');

          response.data = '';
          return response;
        }
        return response;
      },
      responseError: function(rejection) {
        if (rejection.status === 500) {
          toaster.clear();
          toaster.error('失败', '服务器端出现错误，请联系管理员或稍后重试！');
        } else if (rejection.status === -1) {
          toaster.clear();
          toaster.error('失败', '请求超时，请检查网络连接或重试！');
        }

        return $q.reject(rejection);
      }
    };
  }])
