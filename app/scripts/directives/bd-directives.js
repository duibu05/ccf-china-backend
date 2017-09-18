'use strict';

BDMpManagementApp.directive('bdPwCheck', [function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.bdPwCheck;
        elem.add(firstPassword).on('keyup', function() {
          scope.$apply(function() {
            // console.log(firstPassword);
            // console.log(elem.val());
            // console.log($(firstPassword).val());
            // console.info(elem.val() === $(firstPassword).val());
            ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
          });
        });
      }
    }
  }])
  .directive('bdConfirmClick', [function() {
    return {
      link: function(scope, element, attr) {
        var msg = attr.bdConfirmClick || "Are you sure?";
        var clickAction = attr.confirmedClick;
        element.bind('click', function(event) {
          if (window.confirm(msg)) {
            scope.$eval(clickAction)
          }
        });
      }
    };
  }]);
