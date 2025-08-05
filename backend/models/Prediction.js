const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Prediction = sequelize.define('Prediction', {
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Note: The original field was 'result', ensure consistency
  result: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // --- ADD THESE NEW FIELDS ---
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
  // --- END ---
});

// Create the association: A User can have many Predictions
User.hasMany(Prediction);
Prediction.belongsTo(User);

module.exports = Prediction;