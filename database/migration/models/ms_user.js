'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MS_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MS_User.init({
    User_Id: DataTypes.INTEGER,
    Department_Id: DataTypes.INTEGER,
    Role_Id: DataTypes.INTEGER,
    Username: DataTypes.STRING,
    Password: DataTypes.STRING,
    Firsttime_Login: DataTypes.BOOLEAN,
    Firstname: DataTypes.STRING,
    Lastname: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MS_User',
  });
  return MS_User;
};