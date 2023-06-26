'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Parts', {
      Part_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Part_Sub_Group_Id: {
        type: Sequelize.INTEGER
      },
      Part_Name_Mappping_Id: {
        type: Sequelize.INTEGER
      },
      PNC_Id: {
        type: Sequelize.INTEGER
      },
      Part_Code: {
        type: Sequelize.STRING(20)
      },
      Part_Remark: {
        type: Sequelize.STRING(200)
      },
      Part_Substitution_Code: {
        type: Sequelize.STRING(20)
      },
      Part_Start_Time: {
        type: Sequelize.STRING(10)
      },
      Part_End_Time: {
        type: Sequelize.STRING(10)
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
    await queryInterface.dropTable('Parts');
  }
};