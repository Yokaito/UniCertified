'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('type_certified', [
      { 
        name_type_certified: 'Cursos',
        first_hour: 10,
        second_hour: 15,
        third_hour: 20,
        created_at: new Date(),
        updated_at: new Date()
      }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('type_certified', null, {});
  }
};