const Chance = require("chance");
const chanceObj = new Chance();
'use strict';

//https://chancejs.com/index.html
const generateUser = () => {
  return {
    email: chanceObj.email({domain: "example.com"}),
    first_name: chanceObj.first(),
    last_name: chanceObj.last(),
    password :"123456",
    permission: chanceObj.pickone(["ADMIN","USER"]),
    created_at: new Date(),
    updated_at: new Date(),
  };
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userData = [];
    const numUser = 90;

    for(let i = 0; i < numUser; i++){
      userData.push(generateUser());
    }

    await queryInterface.bulkInsert("users",userData,{});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      "users",
      {}
    );
  },
};
