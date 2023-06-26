'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MS_Fuel_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MS_Fuel_Type.init({
    Fuel_Type_Id: DataTypes.INTEGER,
    Fuel_Type: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MS_Fuel_Type',
  });
  return MS_Fuel_Type;
};