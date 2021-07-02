const uuid = require('uuid').v4;
const poolConfig = require('../config')
const Pool = require('pg').Pool
const pool = new Pool(poolConfig.pgConfig)

const socketConnection = require('../socket');

function userRegisteration(userData) {
  return new Promise((resolve, reject) => {
    const userId = uuid();
    const status = 'active';
    const socketIoConnection = socketConnection.getSocketIoConnection()
    pool.connect((err, client, release) => {
      if (err) {
        reject(err)
      }
      client.query('SELECT * FROM users WHERE name = $1', [userData['name']], (error, results) => {
        if (error) {
          release()
          reject(error)
        }
        if(!results.rows.length) {
          client.query('INSERT INTO users (user_id, name, status) VALUES ($1, $2, $3) RETURNING user_id,name,status', [userId, userData['name'], status], (error, results) => {
            release()
            if (error) {
              reject(error)
            }
            socketIoConnection.emit('newUser', results.rows[0]);
            resolve(results.rows[0])
          })
        } else {
          client.query('UPDATE  users SET status = $1 WHERE name = $2 RETURNING user_id,name,status', ['active', userData['name']], (error, results) => {
            release()
            if (error) {
              reject(error)
            }
            resolve(results.rows[0])
          })
        }
      })
    })
  })
}

function getActiveUsers() {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        reject(err)
      }
      client.query("SELECT * FROM users WHERE status = 'active'", (error, results) => {
        release()
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    })
  })
}

function sendMessage(messageData) {
  return new Promise((resolve, reject) => {
    const messageId = uuid();
    const socketIoConnection = socketConnection.getSocketIoConnection()
    pool.connect((err, client, release) => {
      if (err) {
        reject(err)
      }
      client.query('INSERT INTO messages (message_id, from_user_id, to_user_id, message, message_created_time) VALUES ($1, $2, $3, $4, $5) RETURNING message_id,from_user_id,to_user_id,message,message_created_time', [messageId, messageData['from_user_id'], messageData['to_user_id'],messageData['message'],messageData['messageCreatedTime']], (error, results) => {
        release()
        if (error) {
          reject(error)
        }
        socketIoConnection.emit('chat', messageData);
        resolve(results.rows[0]);
      })
    })
  })
}

function logout(userData) {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        reject(err)
      }
      client.query('UPDATE users SET status = $1 WHERE user_id = $2 RETURNING user_id,name,status', ['inactive', userData['userId']], (error, results) => {
        release()
        if (error) {
          reject(error)
        }
        resolve(results.rows[0]);
      })
    })
  })
}


function getAllMessageById(fromUserid, toUserId) {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        reject(err)
      }
      client.query(`select * from messages where from_user_id in ($1, $2) and to_user_id in ($2,$1) order by message_created_time asc`, [fromUserid, toUserId], (error, results) => {
        release()
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    })
  })
}

function updateUserName(userData) {
  return new Promise((resolve, reject) => {
    const socketIoConnection = socketConnection.getSocketIoConnection()
    pool.connect((err, client, release) => {
      if (err) {
        reject(err)
      }
      client.query('UPDATE users SET name = $1 WHERE user_id = $2 RETURNING user_id,name,status', [userData['name'], userData['userId']], (error, results) => {
        release()
        if (error) {
          reject(error)
        }
        socketIoConnection.emit('updateUser', results.rows[0])
        resolve(results.rows[0]);
      })
    })
  })
}

module.exports= {
  userRegisteration,
  getActiveUsers,
  sendMessage,
  logout,
  getAllMessageById,
  updateUserName
}