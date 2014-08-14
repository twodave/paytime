var mongoose = require('../db/connection');
var Payment = require('./Payment');

var InvoiceSchema = new mongoose.Schema({
  display_name: String,
  created_utc: { type: Date, default:Date.now },
  expires_at: Date,
  total: Number, // USD
  private_key: String,
  current_address: String,
  payments: [Payment.schema]
});
var Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
module.exports.schema = InvoiceSchema;