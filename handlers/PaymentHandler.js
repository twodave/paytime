var bitcoin = require('bitcoinjs-lib');
var config = require('../config')
var Invoice = require('../models/Invoice');
var Payment = require('../models/Payment');

module.exports = {
    getAll: function(req,res){
	    var query = { _id: req.params.invoice_id };
		Invoice.findOne(query, function(err,invoice){
			if (err) res.send(err);
			res.json(invoice.payments);
		});
	},
	getOne: function(req,res){
		var query = { _id: req.params.invoice_id };
		Invoice.findOne(query, function(err,invoice){
			if (err) res.send(err);
			res.json(invoice.payments.id(req.params.payment_id));
		});
	},
	post: function(req,res){
	    var query = { _id: req.params.invoice_id };
		Invoice.findOne(query, function(err,invoice){
			if (err) res.send(err);
			
      var address = invoice.current_address;
			var payment = new Payment(req.body);
      
      // make the payment
      var key = bitcoin.ECKey.fromWIF(config.walletKey);
      var tx = new bitcoin.Transaction();
      tx.addInput(payment.tx_hash, 0);
      tx.addOutput(address, amount);
      
      // tx.toHex();
      // to make live, push to: https://blockchain.info/pushtx
      
      payment.address_used = address;
			
      invoice.current_address = key.pub.getAddress().toString(); // not sure if this is different each time
      invoice.payments.push(payment);
      
			invoice.save(function(err, invoice){
				if (err) res.send(err);
				
				res.json({ message: 'Payment created.' });
			});
		});
	},
	delete: function(req,res){
		var query = { _id: req.params.invoice_id };
		Invoice.findOne(query, function(err,invoice){
			if (err) res.send(err);
			invoice.payments.id(req.params.payment_id).remove(function(err){
				if (err) {
          res.send(err);
        }
        invoice.save(function(err,invoice){
          if(err) res.send(err);
          res.json({ message: 'Payment removed.' });
        });
				
			});
		});
	},
}