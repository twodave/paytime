appRoot.controller('IndexController', ['$scope', '$resource', '$rootScope', '$timeout', 'models', '$http', function ($scope, $resource, $rootScope, $timeout, models, $http) {
  // inits
  $scope.invoice = [];
  $scope.newInvoice = new models.api.Invoice();
  $scope.newPayment = new models.api.Payment();
  $scope.flashInfo = "";
  $scope.flashError = "";
  $scope.oneDollarInSatoshis = 0;
  
  // helpers
  $scope.validInvoice = function(){
    return $scope.invoice && $scope.invoice.expires_at && $scope.invoice.getStatus() != "Expired" && $scope.invoice.getStatus() != "Invoice Paid";
  }
  var getConversionRate = function (){
    var path = "https://blockchain.info/q/24hrprice";
    
    $http.get(path)
      .success(function(data,status,headers,config){
        var rate = parseFloat(data.toString());
        $scope.oneDollarInSatoshis = (1/rate) * 100000000;
      });
  };
  
  $scope.getSatoshis = function(dollars){
    return parseInt(dollars * $scope.oneDollarInSatoshis);
  };
  
  $scope.getRunningBalance = function(index) {
    var bal = 0;
    if ($scope.invoice){
      for(var i = 0; i <= index; i++){
        bal += $scope.invoice.payments[i].amount;
      }
      bal = $scope.invoice.total - bal;
    }
    return bal;
  }
  
  //api calls
    $scope.getInvoices = function () {
    return models.api.Invoice.query().then(function (data) {
      if (data.length > 0) {
        $scope.invoice = data[0];
      }
    });
  }
  
  $scope.createInvoice = function() {
    $scope.flashInfo = "";
    $scope.flashError = "";
    $scope.newInvoice.expires_at = new Date($scope.newInvoice.expires_at);
    $scope.newInvoice.save().$promise.then(function(data){
      if (data && data.error) {
        $scope.flashError = data.error;
      }
      if (data && data.message) {
        $scope.flashInfo = data.message;
      }
      $scope.newInvoice = new models.api.Invoice();
      $scope.getInvoices();
    });;
  }
  
  $scope.submitPayment = function() {
    $scope.flashInfo = "";
    $scope.flashError = "";
    $scope.newPayment.amount_in_satoshis = $scope.getSatoshis($scope.newPayment.amount);
    $scope.newPayment.save($scope.invoice).$promise.then(function(data){
      if (data && data.error) {
        $scope.flashError = data.error;
      }
      if (data && data.message) {
        $scope.flashInfo = data.message;
      }
      $scope.newPayment = new models.api.Payment();
      $scope.getInvoices();
    });
  }
  
  $scope.trashInvoice = function(){
    $scope.flashInfo = "";
    $scope.flashError = "";
    var prom = $scope.invoice.destroy().$promise.then(function(){
      $scope.invoice = [];
      $scope.getInvoices();
    });
  }
  
  // startup
  var init = function() {
    $scope.getInvoices();
    
    getConversionRate();
  };
  
  init();
}]);