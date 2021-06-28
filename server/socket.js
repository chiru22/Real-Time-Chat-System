

let socketIoConnection;

function setSocketIoConnection(ioconnection) {
  socketIoConnection = ioconnection;
}

function getSocketIoConnection() {
  return socketIoConnection;
}

module.exports={
  setSocketIoConnection,
  getSocketIoConnection
}