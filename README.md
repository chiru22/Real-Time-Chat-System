# RealTime Chat Application
This is a chat application built with Angular v10 for the frontend, Node.js and Postgres db for the backend and socket.io for event communication.

# Features
- Unique UUID for each user will be created when the user registers.
- Only active user will be shown in the user list.
- Messages are saved in Database and retrieved again upon login.
- Editable Username.
- Session Management across tabs.
- Logout
-- logout button in the application.
-- On browser close.
## Installation

- Application requires [Node.js](https://nodejs.org/) v14.15.1 to run.
- Angular v10.
- Postgres v9.5

### Database:
- Login into postgresql in terminal.
    > psql postgres
- Create a database
  > CREATE DATABASE rtc;
- Connect to DATABASE
    > \c rtc
- Create a table by runing query below,
  ###### Table: user
    CREATE TABLE users ( user_id  VARCHAR(36) NOT NULL, name VARCHAR(30) NOT NULL, status VARCHAR(36) NOT NULL, created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (user_id));

    ###### Table: messages
    CREATE TABLE messages ( message_id  VARCHAR(36) NOT NULL, from_user_id VARCHAR(36) NOT NULL, to_user_id VARCHAR(36) NOT NULL, message TEXT NOT NULL, message_created_time TIMESTAMP NOT NULL, created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (message_id));


## Install the dependencies and devDependencies and start the Client & server.

### Client:

```sh
cd realtimeChatApplication
npm i
npm start
```
 URL: http://localhost:4200/
  The applciation can be accessed by using the above URL.

### Server:

```sh
cd realtimeChatApplication/server
npm i
node server.js
```
##### To update the database config in server
- Goto server folder(cmd: cd sever)
- edit the config.js(cmd: vi config.js)
- please update the database config(Line: 16 in app.js),
    > const pgConfig  = {
    > user: 'xxxxxx',
    > host: 'localhost',
    > database: 'rtc',
    > password: 'xxxxxxx',
    > port: 5432,
    > }


#### Instructions:
- Goto the url(http://localhost:4200/) in two different browser.
- Enter the username and login.
- select the user and start chatting.
