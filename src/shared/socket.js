let socket = require('socket.io-client').connect(window.apihost)

exports.csocket = () => {
  return socket
}
