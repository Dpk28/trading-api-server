//External dependencies
const express = require('express'),
	  cors = require('cors'),
	  bodyParser = require('body-parser'),
	  mongoose = require('mongoose');

const app = express();

//Config file
const config = require('./config.json');
const eventServer = require('./socket.js');
const bitcoin = require('./bitcoin-connect.js');
const eth = require('./eth-connect.js');

//logger
const logger = require('./logger.js');
const loggerName = '[Server: ]';

const port = process.env.PORT || config.port

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

app.on('uncaughtException', function (err) {
	logger.error(loggerName + 'UNCAUGHT EXCEPTION: ' + err);
});

app.on('error', function (err) {
	logger.error(loggerName + 'ERROR: ' + err);
});

//Start event server
eventServer.startEventServer();

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.db, { useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    logger.info(loggerName, 'Connection with MongoDB installed');
});

// Enable Cross Origin Resource Sharing
app.all('/*', function (req, res, next) {
	// CORS headers
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	// Set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Origin,Content-type,Accept,X-Access-Token,X-Key,Cache-Control,X-Requested-With,Access-Control-Allow-Origin,Access-Control-Allow-Credentials');
	if (req.method === 'OPTIONS') { 
		res.status(200).end();
	} else {
		next();
	}
});

//Connection with ethereum node
let web3 = eth.connectToEthereumNode();

let routes = require('./api/routes/routes');
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	return res.status(404).send({ err: 'Not found' });
});

app.listen(port);

console.log(loggerName + ' Trading engine service started on: ' + port);

/**
 * Export the Express app so that it can be used by Chai
 */
module.exports = app;
