'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car_Model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Car_Model.init({
    Car_Model_Id: DataTypes.INTEGER,
    Car_Series_Id: DataTypes.INTEGER,
    Country_Id: DataTypes.INTEGER,
    Car_Model_Name: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Car_Model',
  });
  return Car_Model;
};