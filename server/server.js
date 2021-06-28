const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;
const api = require('./route/api')
const app = express();

const socketIoConnection = require('./socket');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
}); 
socketIoConnection.setSocketIoConnection(io);



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', api);

server.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});

io.on('connection', socket => {
  console.log('User connected');
  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});
