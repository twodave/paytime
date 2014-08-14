var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var path = require("path");


// below are local imports

// route public-facing requests
var viewRouter = require('./routers/ViewRouter');

// route api requests
var apiRouter = require('./routers/ApiRouter');

// handler info for invoices
var InvoiceHandler = require('./handlers/InvoiceHandler');

// handler info for payments
var PaymentHandler = require('./handlers/PaymentHandler');

// global config
var config;
try{ config = require('./config'); } catch(err){ }

// coalesce our config in case it's null
config = config || { };

console.log('Starting up...');
console.log(config);

// allows us to interpret api POST/PUT
app.use(bodyParser());

// set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log('setting up static routes...');
// public folder
app.use('/assets', express.static(__dirname + '/assets'));

console.log('setting up routers...');
// let's get route-y
apiRouter.setup(express, app, { invoice: InvoiceHandler, payment: PaymentHandler });
viewRouter.setup(express, app);

console.log('all set! firing up the server');

// START THE SERVER
// =============================================================================
var port = config.port || 8080; 		// set our port
app.listen(port);
console.log('server listening on port ' + port);