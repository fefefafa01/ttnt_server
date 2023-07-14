'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MS_Attribute_Configs', {
      Dimension_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Attribute_Table: {
        type: Sequelize.STRING(100)
      },
      Attribute_Key: {
        type: Sequelize.STRING(50)
      },
      Attribute_Value: {
        type: Sequelize.STRING(50)
      },
      Attribute_Display_Index: {
        type: Sequelize.INTEGER
      },
      Is_Active: {
        type: Sequelize.BOOLEAN
      },
      Created_Date: {
        type: Sequelize.DATE
      },
      Created_By: {
        type: Sequelize.INTEGER
      },
      Updated_Date: {
        type: Sequelize.DATE
      },
      Updated_By: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MS_Attribute_Configs');
  }
};