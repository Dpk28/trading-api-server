const Client = require('bitcoin-core');

const client = new Client({ 
  network: 'regtest', 
  username: 'bitco34988', 
  password: 'FthX834949384839844787er', 
  port: 18443 
});

module.exports = client;