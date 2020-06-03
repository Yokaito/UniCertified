'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('history_user', { 
      id_history_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      action_data_user: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_type_action_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'type_action', key: 'id_type_action'},
      },
      id_user_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id_user'}
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
    return queryInterface.dropTable('history_user');

  }
};
