let socket = require('socket.io-client').connect(window.socketHost)

exports.csocket = () => {
  return socket
}
