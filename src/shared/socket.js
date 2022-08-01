let socket = require('socket.io-client').connect(window.socketHost, {path: window.socketPath})

exports.csocket = () => {
  return socket
}
