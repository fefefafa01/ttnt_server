'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Part_Sub_Groups', {
      Part_Sub_Group_Id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Part_Group_Id: {
        type: Sequelize.INTEGER
      },
      Part_Sub_Group_Name: {
        type: Sequelize.STRING(200)
      },
      Part_Sub_Group_Code: {
        type: Sequelize.STRING(500)
      },
      Part_Sub_Group_Image: {
        type: Sequelize.STRING(200)
      },
      Part_Sub_Group_Remark: {
        type: Sequelize.STRING(200)
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Part_Sub_Groups');
  }
};