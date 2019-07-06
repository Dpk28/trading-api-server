const eventApp = require('express')(),
      server = require('http').createServer(eventApp),
      logger = require('./logger'),
      io = require('socket.io')(server);

let startEventServer = function () {
    io.on('connection', () => {
        logger.info('[EventServer]:', 'Client is connected!');
    });

    server.listen(4800, () => {
        logger.info('[EventServer]:', 'Socket server started on: 4800');    
    });
}

module.exports.startEventServer = startEventServer;
module.exports.ioObj = io;