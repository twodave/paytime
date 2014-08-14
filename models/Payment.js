var mongoose = require('../db/connection');

var PaymentSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  amount: Number,
  amount_in_satoshis: Number,
  address_used: String,
  private_key: String,
  payer_address: String,
  verified: Boolean
});

var Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
module.exports.schema = PaymentSchema;