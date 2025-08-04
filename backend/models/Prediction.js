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
});

// Create the association: A User can have many Predictions
User.hasMany(Prediction);
Prediction.belongsTo(User);

module.exports = Prediction;