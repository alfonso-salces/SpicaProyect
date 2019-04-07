const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const db = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.SQLITE_URI
});

module.exports = db;