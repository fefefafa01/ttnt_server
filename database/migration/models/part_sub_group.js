'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Part_Sub_Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Part_Sub_Group.init({
    Part_Sub_Group_Id: DataTypes.INTEGER,
    Part_Group_Id: DataTypes.INTEGER,
    Part_Sub_Group_Name: DataTypes.STRING,
    Part_Sub_Group_Code: DataTypes.STRING,
    Part_Sub_Group_Image: DataTypes.STRING,
    Part_Sub_Group_Remark: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Part_Sub_Group',
  });
  return Part_Sub_Group;
};