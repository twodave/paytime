var crunchrModels = angular.module('crunchr.models', []).
  factory('models', ['apiService', '$filter', function (apiService,$filter) {
      Array.prototype.sum = function(property){
        return this.reduce(function(t,c,i,a) { 
          return t + parseFloat(c[property]);
        }, 0.0);
      }
      
      var models = {};

      models.api = {};

      // begin Example
      models.api.Example = function (serverExample) {
          this.exampleID = 0;
          this.message = "Hello World!";

          angular.extend(this, serverExample);
      }

      models.api.Example.path = function () { return "/api/examples/:id"; }

      models.api.Example.query = function (params) { return apiService.query(models.api.Example.path(), models.api.Example, params); }

      models.api.Example.prototype.save = function (callback) {
          if (this.exampleID) {
              return apiService.update(models.api.Example.path(), this.exampleID, this);
          } else {
              return apiService.insert(models.api.Example.path(), this);
          }
      };
      
      models.api.Example.prototype.destroy = function (callback) { return apiService.destroy(models.api.Example.path(), this.exampleID); };
      // end Example
      
      // begin Invoice
      models.api.Invoice = function (serverInvoice) {
          this.display_name = "Default Invoice";
          
          this.created_utc = new Date();
          this.expires_at = null;
          this.total = 0.00;
          this.passphrase = "";
          this.payments = [];
          
          this.getBalance = function() {
            var totalPayments = parseFloat(this.payments.sum('amount')) || 0.0;
            return this.total - totalPayments;
          }
          this.getStatus = function() {
            if (this.getBalance() == 0) {
              return "Invoice Paid";
            } else if (new Date() > new Date(this.expires_at)) {
              return "Expired";
            } else if (this.getBalance() != this.total) {
              return "Partially Paid";
            } else {
              return "Unpaid";
            }
          }
          
          angular.extend(this, serverInvoice);
      }

      models.api.Invoice.path = function () { return "/api/invoices/:invoice_id"; }
      models.api.Invoice.query = function (params) { return apiService.query(models.api.Invoice.path(), models.api.Invoice, params); }

      models.api.Invoice.prototype.save = function (callback) {
          if (this._id) {
              return apiService.update(models.api.Invoice.path(), this._id, this);
          } else {
              return apiService.insert(models.api.Invoice.path(), this);
          }
      };
      
      models.api.Invoice.prototype.destroy = function (callback) { return apiService.destroy(models.api.Invoice.path(), {invoice_id: this._id}); };
      // end Invoice
      
      // begin Payment
      models.api.Payment = function (serverPayment) {
          this.timestamp = new Date();
          this.amount = 0.00;
          this.amount_in_satoshis = 0;
          this.payer_address = "";
          this.verified = false;
          
          angular.extend(this, serverPayment);
      }

      models.api.Payment.path = function () { return "/api/invoices/:invoice_id/payments/:payment_id"; }

      models.api.Payment.query = function (params) { return apiService.query(models.api.Payment.path(), models.api.Payment, params); }

      models.api.Payment.prototype.save = function (invoice) {
          if (this._id) {
              return apiService.update(models.api.Payment.path(), {invoice_id: invoice._id, payment_id: this._id}, this);
          } else {
              return apiService.insert(models.api.Payment.path(), this, {invoice_id: invoice._id});
          }
      };
      
      models.api.Payment.prototype.destroy = function (invoice) { return apiService.destroy(models.api.Payment.path(), {invoice_id: invoice._id, payment_id: this._id}); };
      // end Payment

      return models;
  }]);