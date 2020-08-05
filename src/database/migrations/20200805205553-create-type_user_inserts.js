'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('type_user', [
      { 
        name_type_user: 'Administrador',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_user: 'Moderador',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_user: 'Usuário',
        created_at: new Date(),
        updated_at: new Date()
      },
      
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('type_user', null, {});
  }
};
