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
      { 
        name_type_action: 'Aprovar Aluno',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Reprovar Aluno',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Habilitar Edição Aluno',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Aprovar Certificado',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Reprovar Certificado',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Habilitar Edição Certificado',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Criou um Certificado',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        name_type_action: 'Deletou um Certificado',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name_type_action: 'Editou um Certificado',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name_type_action: 'Informações Pessoais Editadas',
        created_at: new Date(),
        updated_at: new Date()
      },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('type_action', null, {});
  }
};
