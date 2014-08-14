var bitcoin = require('bitcoinjs-lib');
var config = require('../config');
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
      
      var totalPayments = payment.amount + invoice.payments.reduce(function(t,c,i,a) { return t + c['amount']; }, 0);
      
      if (totalPayments > invoice.total){
        res.json({ message: 'Payment rejected (too high)'});
        return;
      }
      console.log(invoice.expires_at);
      console.log(new Date(Date.now()));
      console.log(invoice.expires_at < new Date(Date.now()));
      if (invoice.expires_at < new Date(Date.now())) {
        res.json({ message: 'Payment rejected (invoice expired)'});
        return;
      }
      
      // make the payment
      var key = bitcoin.ECKey.fromWIF(invoice.private_key);
      var tx = new bitcoin.Transaction();
      console.log(payment.tx_hash);
      tx.addInput(payment.tx_hash, 0);
      tx.addOutput(address, payment.amount_in_satoshis);
      tx.sign(0, key);
      
      // tx.toHex();
      // to make live, push to: https://blockchain.info/pushtx
      
      // log stuff
      payment.private_key = invoice.private_key;
      payment.address_used = address;
			
      // new key/address combo needed
      var newKey = bitcoin.ECKey.makeRandom();
      invoice.current_address = newKey.pub.getAddress().toString(); // not sure if this is different each time
      invoice.private_key = newKey.toWIF();
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