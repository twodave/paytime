var qr = require('qr-image');

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