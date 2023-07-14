'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Manufacturers', {
      Manufacturer_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Manufacturer_Name: {
        type: Sequelize.STRING(50)
      },
      Type: {
        type: Sequelize.STRING(50)
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
    await queryInterface.dropTable('Manufacturers');
  }
};