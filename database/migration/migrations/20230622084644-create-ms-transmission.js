'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MS_Transmissions', {
      Transmission_Type_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Transmission_Code: {
        type: Sequelize.STRING(20)
      },
      Transmission_Type: {
        type: Sequelize.STRING(20)
      },
      Transmission_Detail: {
        type: Sequelize.STRING(20)
      },
      Speed: {
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
    await queryInterface.dropTable('MS_Transmissions');
  }
};