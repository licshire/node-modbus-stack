var PORT = 8503;
var ModbusRequestStack = require('modbus-stack').ModbusRequestStack;
var s = require('modbus-stack/server');
var assert = require('assert');

exports['server with a "handlers" Object'] = function() {
  var handlers = {};
  handlers[4] = function(req, res) {
    console.log(req);
    assert.equal(req.startAddress, 0);
    assert.equal(req.quantity, 10);
    var rtn = new Array(req.quantity);
    for (var i=0; i<req.quantity; i++) {
      rtn[i] = req.startAddress + i;
    }
    res.writeResponse(rtn);
  }
  var server = s.createServer(handlers);
  server.listen(PORT, function() {
    var conn = require('net').createConnection(PORT);
    var clientRequest = new ModbusRequestStack(conn);
    clientRequest.request(4, 0, 10, function(err, clientResponse) {
      console.log(clientResponse);
      conn.end();
      server.close();
    });
  });
}
