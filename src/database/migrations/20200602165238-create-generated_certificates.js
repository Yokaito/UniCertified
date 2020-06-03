'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('generated_certificates', { 
      id_generated_certificates: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      value_generated_certificates: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },    
      picture_generated_certificates: {
        type: Sequelize.BLOB,
        allowNull: true,
      },
      id_user_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id_user'}
      },
      id_certified_generated: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'certified_generated', key: 'id_certified_generated'}
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
    return queryInterface.dropTable('generated_certificates');
    
  }
};
