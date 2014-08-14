var bitcoin = require('bitcoinjs-lib');
var config = require('../config');
var Invoice = require('../models/Invoice');

module.exports = {
    getAll: function(req,res){
		Invoice.find(function(err,invoices){
			if (err) res.send(err);
			invoices.reduce(function(t,c,i,a) { return c['private_key'] = null; }, 0); // gotta scrub the pk
			res.json(invoices);
		});
	},
	getOne: function(req,res){
	  var query = { _id: req.params.invoice_id };
		Invoice.findOne(query, function(err,invoice){
			if (err)
				res.send(err);
        invoice.private_key = null; // gotta scrub this
				res.json(invoice);
		});
	},
	post: function(req,res){
	  var invoice = new Invoice(req.body);
    var key = bitcoin.ECKey.makeRandom();
    
    invoice.current_address = key.pub.getAddress().toString(); // not sure if this is different each time
    invoice.private_key = key.toWIF();
    
		invoice.save(function(err, invoice){
      if (err){
        res.send(err);
			}
			
			res.json({ message: 'Invoice created: ' + invoice._id });
		});
	},
	delete: function(req,res){
		var query = { _id: req.params.invoice_id };
		Invoice.findOneAndRemove(query, function(err,invoice){
			if (err)
				res.send(err);

				res.json({ message: 'Invoice removed.' });
		});
	},
}