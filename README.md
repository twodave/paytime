# PayTime

OK, head on over to [http://autojson.com/](http://autojson.com/) for a demo whenever you're ready.

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