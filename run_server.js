let server = require('./server');
let settings = require("./server/settings");

server.listen(settings.variables.SERVER_PORT, function () {
  console.log('[SERVER] Listening on *:' + settings.variables.SERVER_PORT);
});