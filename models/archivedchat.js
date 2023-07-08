const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const ArchivedChat = sequelize.define("archivedChat", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  textMessage: DataTypes.STRING,
  attachment: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  userId: DataTypes.INTEGER,
  groupId: DataTypes.INTEGER,
});

module.exports = ArchivedChat;