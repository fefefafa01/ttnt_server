'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MS_Transmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MS_Transmission.init({
    Transmission_Type_Id: DataTypes.INTEGER,
    Transmission_Code: DataTypes.STRING,
    Transmission_Type: DataTypes.STRING,
    Transmission_Detail: DataTypes.STRING,
    Speed: DataTypes.INTEGER,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MS_Transmission',
  });
  return MS_Transmission;
};