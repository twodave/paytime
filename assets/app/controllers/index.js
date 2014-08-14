appRoot.controller('IndexController', ['$scope', '$resource', '$rootScope', '$timeout', 'models', function ($scope, $resource, $rootScope, $timeout, models) {
  $scope.invoice = [];
  $scope.newInvoice = new models.api.Invoice();
  $scope.getInvoices = function () {
      return models.api.Invoice.query().then(function (data) {
        if (data.length > 0) {
          $scope.invoice = data[0];
        }
      });
  }
  
  $scope.createInvoice = function() {
    $scope.newInvoice.save();
    $scope.getInvoices();
  }
  
  var init = function() {
    $scope.getInvoices();
  };
  init();
}]);