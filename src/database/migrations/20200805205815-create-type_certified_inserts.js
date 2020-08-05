'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('type_certified', [
      { 
        name_type_certified: 'Cursos',
        created_at: new Date(),
        updated_at: new Date()
      }
      /* 🟠 Criar os inserts de cada tipo de ceritifcado para quando criar o bando de dados os dados ja estejam la para usar como chave estrangeira */
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('type_certified', null, {});
  }
};
