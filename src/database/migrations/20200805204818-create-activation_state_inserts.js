'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('activation_state', [
      { 
        name_activation_state: 'Ativado',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name_activation_state: 'Não Ativo',
        created_at: new Date(),
        updated_at: new Date()
      }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('activation_state', null, {});
  }
};
