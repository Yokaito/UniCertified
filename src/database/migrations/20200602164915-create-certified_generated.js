'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('certified_generated', { 
      id_certified_generated: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name_certified_generated: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },    
      id_model_certified_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'model_certified', key: 'id_model_certified'}
      },
      id_type_certified_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'type_certified', key: 'id_type_certified'}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('certified_generated');    
  }
};
