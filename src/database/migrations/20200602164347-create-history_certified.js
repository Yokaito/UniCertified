'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('history_certified', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      action_date_certified: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      id_certified_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'certified', key: 'id'}
      },
      id_user_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
      },
      id_type_action_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'type_action', key: 'id'}
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
    return queryInterface.dropTable('history_certified');
  }
};
