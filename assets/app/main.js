// Main configuration file. Sets up AngularJS module and routes and any other config objects

var appRoot = angular.module('main', ['ngRoute','ngResource', 'crunchr.context', 'crunchr.models']);     //Define the main module
appRoot
    .config(['$routeProvider', function ($routeProvider) {
        //Setup routes to load partial templates from server. TemplateUrl is the location for the server view (Razor .cshtml view)
        $routeProvider
            .when('/', { templateUrl: '/partials/index', controller: 'IndexController' })
            .otherwise({ redirectTo: '/app/' });
    }])
    .controller('RootController', ['$scope', '$route', '$routeParams', '$location', function ($scope, $route, $routeParams, $location) {
        $scope.$on('$routeChangeSuccess', function (e, current, previous) {
            $scope.activeViewPath = $location.path();
        });
    }]);
    
appRoot
  .directive('ngConfirmClick', [
  function () {
      return {
          priority: -1,
          restrict: 'A',
          link: function (scope, element, attrs) {
              element.bind('click', function (e) {
                  var message = attrs.ngConfirmClick;
                  if (message && !confirm(message)) {
                      e.stopImmediatePropagation();
                      e.preventDefault();
                  }
              });
          }
      }
  }
]);

appRoot
  .directive('decimalInput', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      var fromUser = function (text) {
        var transformedInput = text.toString().replace(/[^0-9\.\$\-]/g, '');
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
        }
        return transformedInput;  // or return Number(transformedInput)
        
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});

appRoot
  .directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
         link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'mm/dd/yy',
                onSelect: function (date) {
                    scope.date = date;
                    scope.$apply();
                }
            });
        }
    };
});