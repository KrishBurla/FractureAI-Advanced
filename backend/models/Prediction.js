const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Prediction = sequelize.define('Prediction', {
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  annotatedImagePath: { // <-- ADD THIS
    type: DataTypes.STRING,
    allowNull: true,
  },
  result: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  patientAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  patientSex: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  patientId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(Prediction);
Prediction.belongsTo(User);

module.exports = Prediction;