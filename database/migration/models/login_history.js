'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Login_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Login_History.init({
    History_Id: DataTypes.INTEGER,
    User_Id: DataTypes.INTEGER,
    Login_Date: DataTypes.DATE,
    IP: DataTypes.STRING,
    Device: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Login_History',
  });
  return Login_History;
};