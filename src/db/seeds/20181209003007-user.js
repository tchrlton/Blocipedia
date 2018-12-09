'use strict';

const faker = require("faker");

let user = [];

for(let i = 1 ; i <= 15 ; i++){
  user.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: "standard",
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", user, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
