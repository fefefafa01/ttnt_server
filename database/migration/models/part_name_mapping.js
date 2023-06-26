'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Part_Name_Mapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Part_Name_Mapping.init({
    Part_Name_Mappping_Id: DataTypes.INTEGER,
    Manufacturer_Id: DataTypes.INTEGER,
    Part_Sub_Group_Id: DataTypes.INTEGER,
    PNC: DataTypes.STRING,
    Part_Code: DataTypes.STRING,
    Manufacturer_Name: DataTypes.STRING,
    Argos_Part_Name: DataTypes.STRING,
    AISIN_Group_Name: DataTypes.STRING,
    AISIN_Sub_Group_Name: DataTypes.STRING,
    AISIN_Part_Name: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Part_Name_Mapping',
  });
  return Part_Name_Mapping;
};