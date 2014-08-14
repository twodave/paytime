var mongoose = require('../db/connection');

var PaymentSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  amount: Number,
  address_used: String,
  tx_hash: String
});

var Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
module.exports.schema = PaymentSchema;