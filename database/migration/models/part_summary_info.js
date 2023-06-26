'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Part_Summary_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Part_Summary_Info.init({
    Data_Date: DataTypes.DATE,
    Country_Name: DataTypes.STRING,
    Country_Name_Abb: DataTypes.STRING,
    Car_Brand_Name: DataTypes.STRING,
    Car_Model_Name: DataTypes.STRING,
    Model_Code: DataTypes.STRING,
    Engine_Model: DataTypes.STRING,
    Vehicle_Type: DataTypes.STRING,
    Transmission_Code: DataTypes.STRING,
    Transmission_Type: DataTypes.STRING,
    Part_Group_Name: DataTypes.STRING,
    Part_Sub_Group_Name: DataTypes.STRING,
    Original_Part_Name: DataTypes.STRING,
    Start_of_Production: DataTypes.STRING,
    End_of_Production: DataTypes.STRING,
    AISIN_Premium_Code: DataTypes.STRING,
    AISIN_Sub_Premium_Code: DataTypes.STRING,
    Total: DataTypes.INTEGER,
    Coverage: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Part_Summary_Info',
  });
  return Part_Summary_Info;
};