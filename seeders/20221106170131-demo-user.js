'use strict';
const bcrypt = require("bcrypt")

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface,bulkInsert('users',[
      {
        username: 'Said Agung',
        email:'saidagung@gmail.com',
        password: await bscrypt.hash("123456",10),
        role:"superAdmin",
      }
    ],)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
