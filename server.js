// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require("path");
var viewRouter = require('./routers/ViewRouter');
var session = require('express-session');
var config = require('./config');
var apiRouter = require('./routers/ApiRouter');
var InvoiceHandler = require('./handlers/InvoiceHandler');
var PaymentHandler = require('./handlers/PaymentHandler');

config = config || { };

console.log('Starting up...');

console.log(config);

app.use(cookieParser());
app.use(bodyParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log('setting up static routes...');

// public folders
app.use('/assets', express.static(__dirname + '/assets'));
console.log('setting up routers...');

apiRouter.setup(express, app, { invoice: InvoiceHandler, payment: PaymentHandler });
viewRouter.setup(express, app);

console.log('firing up the server');

// START THE SERVER
// =============================================================================
var port = config.port || 8080; 		// set our port
app.listen(port);
console.log('server running on port ' + port);