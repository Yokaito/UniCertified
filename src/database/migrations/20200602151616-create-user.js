'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', { 
      id_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email_user: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
      },
      name_user: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      password_user: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_type_user_foreign: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'type_user', key: 'id_type_user'},
      },
      id_state_foreign: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'state', key: 'id_state'},
      },
      last_access_date_user: {
        type: Sequelize.DATE,
        allowNull: false
      },
      activation_key_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      id_activation_state_foreign: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'activation_state', key: 'id_activation_state'},
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
    return queryInterface.dropTable('user');
  }
};
