'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MS_Users', {
      User_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Department_Id: {
        type: Sequelize.INTEGER
      },
      Role_Id: {
        type: Sequelize.INTEGER
      },
      Username: {
        type: Sequelize.STRING(100)
      },
      Password: {
        type: Sequelize.STRING(100)
      },
      Firsttime_Login: {
        type: Sequelize.BOOLEAN
      },
      Firstname: {
        type: Sequelize.STRING(100)
      },
      Lastname: {
        type: Sequelize.STRING(100)
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
    await queryInterface.dropTable('MS_Users');
  }
};