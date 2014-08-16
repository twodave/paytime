# PayTime

PayTime is a proof-of-concept bitcoin invoice web application. 

## Demo

To work with a demo, go to: [http://autojson.com/](http://autojson.com/).

** NOTE: do NOT use the demo for any real transactions (unless you wish to donate to the author, of course).

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