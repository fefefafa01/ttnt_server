'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Part_Name_Mappings', {
      Part_Name_Mappping_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Manufacturer_Id: {
        type: Sequelize.INTEGER
      },
      Part_Sub_Group_Id: {
        type: Sequelize.INTEGER
      },
      PNC: {
        type: Sequelize.STRING(10)
      },
      Part_Code: {
        type: Sequelize.STRING(20)
      },
      Manufacturer_Name: {
        type: Sequelize.STRING(100)
      },
      Argos_Part_Name: {
        type: Sequelize.STRING(500)
      },
      AISIN_Group_Name: {
        type: Sequelize.STRING(100)
      },
      AISIN_Sub_Group_Name: {
        type: Sequelize.STRING(100)
      },
      AISIN_Part_Name: {
        type: Sequelize.STRING(500)
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
    await queryInterface.dropTable('Part_Name_Mappings');
  }
};