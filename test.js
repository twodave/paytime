var bitcoin = require('bitcoinjs-lib');

key = bitcoin.ECKey.makeRandom();

console.log(key.toWIF());