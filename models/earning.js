'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Earning extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Earning.init({
    user_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    source_user_id: DataTypes.INTEGER,
    level: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Earning',
  });
  return Earning;
};