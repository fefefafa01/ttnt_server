'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MS_Attribute_Config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MS_Attribute_Config.init({
    Dimension_Id: DataTypes.INTEGER,
    Attribute_Table: DataTypes.STRING,
    Attribute_Key: DataTypes.STRING,
    Attribute_Value: DataTypes.STRING,
    Attribute_Display_Index: DataTypes.INTEGER,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MS_Attribute_Config',
  });
  return MS_Attribute_Config;
};