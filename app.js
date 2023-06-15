const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./util/database');
const User = require('./models/user');
const Message = require('./models/message');

const app = express();
app.use(cors({
    origin: '*'
}));

User.hasMany(Message);
Message.belongsTo(User);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/user');
const msgRoutes = require('./routes/message');

app.use(userRoutes);
app.use(msgRoutes);

sequelize.sync().then(() => {
    app.listen(3000);
})
.catch(err => console.log(err))

