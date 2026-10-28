const { Sequelize } = require('sequelize');
require('dotenv').config();
module.exports = new Sequelize(process.env.DB_NAME || 'alfred_db', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql', logging: false, define: { underscored: true, timestamps: true }
});
