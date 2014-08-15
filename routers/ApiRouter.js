var qr = require('qr-image');
var http = require('http');
var Invoice = require('../models/Invoice');
module.exports = {
  setup: function(express, app, handlers){
    var apiRouter = express.Router();
    
    // middleware to use for all requests
    apiRouter.use(function(req, res, next) {
      // do logging
      
      if (req.body.length > 0){
        console.log(JSON.stringify(req.body));
      }
      console.log('[api] ' + req.method + ': ' + req.url);
      next(); // make sure we go to the next routes and don't stop here
      
    });

    apiRouter.put('/verify/:invoice_id/:payment_id', function (req,res) {
      var query = { _id: req.params.invoice_id };
      Invoice.findOne(query, function(err,invoice){
        if (err) {
          res.send(err);
        }
        
        if (invoice && invoice.payments){
          console.log('found invoice w/ payments');
          var paymentFound = false;
          for(var k = 0; k < invoice.payments.length; k++) {
            var payment = invoice.payments[k];
            if (payment._id != req.params.payment_id) continue;
            
            if (!payment){
              res.json({error: "payment not found."});
            }
            
            console.log('found payment');
            paymentFound = true;
            
            var toAddress = payment.address_used;
            var fromAddress = payment.payer_address;
            
            var verifyPath = "http://blockchain.info/address/"+fromAddress+"?format=json";
            console.log('verifying from: ' + fromAddress + ', to: ' + toAddress);
            console.log('network path: ' + verifyPath);
            // ok lets grab a json blob
            http.get(verifyPath, function(response){
              var body = "";
              response.on('data',function(chunk) {
                body += chunk;
              });
              response.on('end',function() {
                var data = JSON.parse(body);
                var txs = data.txs;
                if (txs) {
                  for(var i = 0; i < txs.length;i++) {
                    var tx = txs[i];
                    if (tx.out){
                      for(var j = 0; j < tx.out.length; j++) {
                        if (j.spent && j.value == payment.amount_in_satoshis && j.addr == payment.toAddress) {
                          payment.verified = true;
                          payment.save(function(err,payment) {
                            if (err) res.send(err);
                            res.json({ message: 'Payment verified.', verified: true });
                            return;
                          });
                        } else {
                          res.json({ message: 'Payment not verified', verified: false });
                          return;
                        }
                      }
                    }
                  }
                } else{
                  res.json({ message: 'Payment not verified', verified: false });
                  return;
                }
              });
            });
          }
          res.json({ message: 'Payment not verified', verified: false });
          return;
        }else{
          res.json({ message: 'Payment not verified', verified: false });
        }
      });
    });
    apiRouter.get('/qr/:code', function(req, res) {
      var code = qr.image(req.params.code, {type: 'svg'});
      res.type('svg');
      code.pipe(res);
    });

    apiRouter.route('/invoices')
      .get(handlers.invoice.getAll)
      .post(handlers.invoice.post);

    apiRouter.route('/invoices/:invoice_id')
    .get(handlers.invoice.getOne)
    .delete(handlers.invoice.delete);

    apiRouter.route('/invoices/:invoice_id/payments')
    .post(handlers.payment.post)
    .get(handlers.payment.getAll);

    apiRouter.route('/invoices/:invoice_id/payments/:payment_id')
    .get(handlers.payment.getOne)
    .delete(handlers.payment.delete);


    app.use('/api', apiRouter);
  }
}