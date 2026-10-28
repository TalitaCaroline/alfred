const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(190), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  fullName: { type: DataTypes.STRING(120), allowNull: false },
  preferredCity: { type: DataTypes.STRING(90), allowNull: true },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'users' });

const Venue = sequelize.define('Venue', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(130), allowNull: false },
  city: { type: DataTypes.STRING(90), allowNull: false },
  state: { type: DataTypes.STRING(2), allowNull: false },
  address: { type: DataTypes.STRING(255), allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true }
}, { tableName: 'venues' });

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.ENUM('cinema','shows','baladas','teatro','danca','cultura'), allowNull: false },
  startAt: { type: DataTypes.DATE, allowNull: false },
  endAt: { type: DataTypes.DATE, allowNull: true },
  genres: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  accent: { type: DataTypes.STRING(30), allowNull: true },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'events' });

const TicketLot = sequelize.define('TicketLot', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(60), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  available: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } }
}, { tableName: 'ticket_lots' });

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('DEMO'), allowNull: false, defaultValue: 'DEMO' }
}, { tableName: 'orders' });

Venue.hasMany(Event, { foreignKey: { name: 'venueId', allowNull: false }, as: 'events' });
Event.belongsTo(Venue, { foreignKey: { name: 'venueId', allowNull: false }, as: 'venue' });
Event.hasMany(TicketLot, { foreignKey: { name: 'eventId', allowNull: false }, as: 'lots' });
TicketLot.belongsTo(Event, { foreignKey: { name: 'eventId', allowNull: false }, as: 'event' });
User.hasMany(Order, { foreignKey: { name: 'userId', allowNull: false }, as: 'orders' });
Order.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, as: 'user' });
Event.hasMany(Order, { foreignKey: { name: 'eventId', allowNull: false }, as: 'orders' });
Order.belongsTo(Event, { foreignKey: { name: 'eventId', allowNull: false }, as: 'event' });
TicketLot.hasMany(Order, { foreignKey: { name: 'ticketLotId', allowNull: false }, as: 'orders' });
Order.belongsTo(TicketLot, { foreignKey: { name: 'ticketLotId', allowNull: false }, as: 'lot' });

module.exports = { sequelize, User, Venue, Event, TicketLot, Order };
