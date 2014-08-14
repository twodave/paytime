var Invoice = require('../models/Invoice');

module.exports = {
    getAll: function(req,res){
		Invoice.find(function(err,invoices){
			if (err) res.send(err);
			
			res.json(invoices);
		});
	},
	getOne: function(req,res){
	  var query = { _id: req.params.invoice_id };
		Invoice.findOne(query, function(err,invoice){
			if (err)
				res.send(err);

				res.json(invoice);
		});
	},
	put: function(req,res){
		var query = { _id: req.params.invoice_id };
		Invoice.findOneAndUpdate(query, req.body, function(err,invoice){
			if (err)
				res.send(err);

				res.json({ message: 'Invoice updated.' });
		});
	},
	post: function(req,res){
	  var invoice = new Invoice(req.body);
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