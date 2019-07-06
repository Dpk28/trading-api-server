const config = require('./config.json');
const Web3 = require('web3');

let web3 = null;

module.exports = {
	connectToEthereumNode: function() {
		web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(config.ethereumNodeUrl));
	    return web3;
    },

  	getWeb3: function() {
    	return web3;
  	}
};