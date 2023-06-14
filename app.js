const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./util/database');
const User = require('./models/user');

const app = express();
app.use(cors({
    origin: '*'
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/user');

app.use(userRoutes);

sequelize.sync().then(() => {
    app.listen(3000);
})
.catch(err => console.log(err))

