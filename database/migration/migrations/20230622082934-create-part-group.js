"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Part_Groups", {
            part_group_id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            part_group_name: {
                type: Sequelize.STRING(50),
            },
            is_active: {
                type: Sequelize.BOOLEAN,
            },
            created_date: {
                type: Sequelize.DATE,
            },
            created_by: {
                type: Sequelize.INTEGER,
            },
            updated_date: {
                type: Sequelize.DATE,
            },
            updated_by: {
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Part_Groups");
    },
};
