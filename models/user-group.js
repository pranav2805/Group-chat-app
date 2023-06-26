const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserGroup = sequelize.define('userGroup', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
});

module.exports = UserGroup;
