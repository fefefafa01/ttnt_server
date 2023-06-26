'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Login_Histories', {
      History_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      User_Id: {
        type: Sequelize.INTEGER
      },
      Login_Date: {
        type: Sequelize.DATE
      },
      IP: {
        type: Sequelize.STRING(20)
      },
      Device: {
        type: Sequelize.STRING(20)
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Login_Histories');
  }
};