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

    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    apiRouter.get('/', function(req, res) {
      res.render('index',{title:'API Info'});
    });

    apiRouter.route('/invoices')
      .get(handlers.invoice.getAll)
      .post(handlers.invoice.post);

    apiRouter.route('/invoice/:invoice_id')
    .get(handlers.invoice.getOne)
    .put(handlers.invoice.put)
    .delete(handlers.invoice.delete);

    apiRouter.route('/invoice/:invoice_id/payments')
    .post(handlers.payment.post)
    .get(handlers.payment.getAll);

    apiRouter.route('/invoice/:invoice_id/payments/:payment_id')
    .get(handlers.payment.getOne)
    .delete(handlers.payment.delete);


    app.use('/api', apiRouter);
  }
}