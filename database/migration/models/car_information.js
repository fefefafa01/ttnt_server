'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car_Information extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Car_Information.init({
    Car_Info_Id: DataTypes.INTEGER,
    AISIN_Vehicle_Code: DataTypes.STRING,
    Car_Model_Id: DataTypes.INTEGER,
    Displacement_Id: DataTypes.INTEGER,
    Power_Type_Id: DataTypes.INTEGER,
    Fuel_Type_Id: DataTypes.INTEGER,
    Transmission_Type_Id: DataTypes.INTEGER,
    Drivetrain_Id: DataTypes.INTEGER,
    Model_Code_Id: DataTypes.INTEGER,
    Argos_Vehicle_Code: DataTypes.STRING,
    Chassis_Code: DataTypes.STRING,
    Engine_Model: DataTypes.STRING,
    Vehicle_Type: DataTypes.STRING,
    Drivers_Position: DataTypes.STRING,
    Start_of_Production: DataTypes.STRING,
    End_of_Production: DataTypes.STRING,
    Sales_Country: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Car_Information',
  });
  return Car_Information;
};