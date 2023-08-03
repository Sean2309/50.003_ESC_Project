const WebSocket = require('ws');
function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", function (webSocket) {
    webSocket.on("message", function (message) {
      webSocket.send(message);
    });
  });
}

function startServer(port) {
    const server = http.createServer();
    createWebSocketServer(server);
    return new Promise((resolve) => {
      server.listen(port, () => resolve(server));
    });
}

function waitForSocketState(socket, state) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (socket.readyState === state) {
        resolve();
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 5);
  });
}
module.exports = { startServer, waitForSocketState };

