const Chance = require("chance");
const chanceObj = new Chance();
const bcrypt = require("bcrypt");
("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            "SELECT user_id FROM ms_user"
        );
        const userIds = users[0].map((user) => user.user_id);

        const departments = await queryInterface.sequelize.query(
            "SELECT department_id FROM ms_department"
        );
        const departmentIds = departments[0].map(
            (department) => department.department_id
        );

        const roles = await queryInterface.sequelize.query(
            "SELECT role_id FROM ms_role"
        );
        const roleIds = roles[0].map((role) => role.role_id);

        const data = [];
        const numPart = 5;
        for (let i = 0; i < numPart; i++) {
            const password = "123456789";
            const hashedPass = await bcrypt.hash(password, 10);
            data.push({
                department_id: chanceObj.pickone(departmentIds),
                role_id: chanceObj.pickone(roleIds),
                username: chanceObj.email({
                    domain: ["gmail.com", "example.com"],
                }),
                password: hashedPass,
                firsttime_login: chanceObj.bool(),
                firstname: chanceObj.first(),
                lastname: chanceObj.last(),
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("ms_user", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("ms_user", {});
    },
};
