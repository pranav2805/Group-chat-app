const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);


const sequelize = require('./util/database');
const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const UserGroup = require('./models/user-group');
const setUpSocket = require('./socket');

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

setUpSocket(httpServer);

const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
    // app.listen(5000); //will not work here, as it creates a new HTTP server
    httpServer.listen(5000, () => {
        console.log(`Chat app: listening on port ${port}`);
    })
})
.catch(err => console.log(err))

