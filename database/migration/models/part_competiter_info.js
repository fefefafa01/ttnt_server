'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Part_Competiter_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Part_Competiter_Info.init({
    Part_Id: DataTypes.INTEGER,
    Manufacturer_Id: DataTypes.INTEGER,
    Competiter_Part_Code: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Part_Competiter_Info',
  });
  return Part_Competiter_Info;
};