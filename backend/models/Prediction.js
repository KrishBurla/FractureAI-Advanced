const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Prediction = sequelize.define('Prediction', {
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
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
  // --- ADD THIS NEW FIELD ---
  patientId: {
    type: DataTypes.STRING,
    allowNull: true, // Set to false if you want it to be a required field
  },
});

User.hasMany(Prediction);
Prediction.belongsTo(User);

module.exports = Prediction;