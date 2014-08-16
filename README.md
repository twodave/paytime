# PayTime

PayTime is a proof-of-concept bitcoin invoice web application. 

## Demo

To work with a demo, go to: [http://autojson.com/](http://autojson.com/).

**NOTE**: do NOT use the demo for any real transactions (unless you wish to donate to the author, of course).

## Deployment instructions

You can run this project yourself via the following:

```
> git clone https://github.com/twodave/paytime.git
> cd paytime
> node server.js
```

## Configuration

By default the project uses a public/dev port and database connection. To change this, place a `config.js` in your project root that looks similar to the following:

```
var config = {};
config.mongoString = "your-db-string-or-blank-for-default"; // just use default;
config.port = 80; // or 0, "", or null for port 8080

module.exports = config;
```

The config.js is not required.

## Important

1. Only one invoice is supported at a time, and invoices can be trashed at any time, which will also destroy any payment records (and their private keys).
2. Transactions are both double-entered and "lazy verified" at the moment, which isn't optimal. A better way would be to monitor the payment address on the blockchain for activity and auto-create the payment.
3. Another by-product of #2, payments are not guaranteed to be anonymous. By collecting data via the web app, the server could possibly associate a public IP and date with a payment. If subpoenaed, this could lead to revealing the payer's identity.
4. Payment addresses that are no longer being monitored are still displayed on the screen after payment is made. This could result in un-collected payments.

## License

PayTime is distributed under the MIT license.