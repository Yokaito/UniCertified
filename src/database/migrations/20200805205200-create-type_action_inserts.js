'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('type_action', [
      { 
        name_type_action: 'Edição',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Inserção',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Deletado',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Criação',
        created_at: new Date(),
        updated_at: new Date()
      },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('type_action', null, {});
  }
};
