'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Part extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Part.init({
    Part_Id: DataTypes.INTEGER,
    Part_Sub_Group_Id: DataTypes.INTEGER,
    Part_Name_Mappping_Id: DataTypes.INTEGER,
    PNC_Id: DataTypes.INTEGER,
    Part_Code: DataTypes.STRING,
    Part_Remark: DataTypes.STRING,
    Part_Substitution_Code: DataTypes.STRING,
    Part_Start_Time: DataTypes.STRING,
    Part_End_Time: DataTypes.STRING,
    Is_Active: DataTypes.BOOLEAN,
    Created_Date: DataTypes.DATE,
    Created_By: DataTypes.INTEGER,
    Updated_Date: DataTypes.DATE,
    Updated_By: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Part',
  });
  return Part;
};