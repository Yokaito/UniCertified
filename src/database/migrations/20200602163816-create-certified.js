'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('certified', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name_certified: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      value_certified: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      picture_certified: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      id_type_certified_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'type_certified', key: 'id'}
      },
      id_user_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
      },
      id_state_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'state', key: 'id'}
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
    return queryInterface.dropTable('certified');
  }
};
