const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./util/database');
const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const UserGroup = require('./models/user-group');

const app = express();

app.use(cors({
    origin: '*'
}));

User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId'});
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId'});

// Group.hasMany(UserGroup);

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

sequelize.sync().then(() => {
    app.listen(3000);
})
.catch(err => console.log(err))

