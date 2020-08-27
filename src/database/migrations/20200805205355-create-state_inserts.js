'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('state', [
      { 
        name_state: 'Aprovado',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_state: 'Em análise',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_state: 'Reprovado',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name_state: 'Pré-Aprovado',
        created_at: new Date(),
        updated_at: new Date()
      }
      
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('state', null, {});
  }
};
