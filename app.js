const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  /* options */
});

const sequelize = require('./util/database');
const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const UserGroup = require('./models/user-group');

app.use(cors({
    origin: '*'
}));

User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId'});
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId'});

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/user');
const msgRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');

app.use(userRoutes);
app.use(msgRoutes);
app.use(groupRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

/* 
! This sets up an event listener for the "connection" event.
! When a client connects to the server, the callback function is called 
! with a socket object representing the connection.
*/
io.on("connection", (socket) => {
    console.log("BE: io.on connection");
  
    socket.on("send-message", (message) => {
        io.emit("message-received");
    });

    socket.on("group-update", () => {
        io.emit("groupUpdated");
    })
});

const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
    // app.listen(5000); //will not work here, as it creates a new HTTP server
    httpServer.listen(5000, () => {
        console.log(`Chat app: listening on port ${port}`);
    })
})
.catch(err => console.log(err))

