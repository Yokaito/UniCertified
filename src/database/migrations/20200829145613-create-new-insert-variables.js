'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('variables', [
      { 
        name_variable: 'Horas Totais',
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date()
      }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('variables', null, {});
  }
};