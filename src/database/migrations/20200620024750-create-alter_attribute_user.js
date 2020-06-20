'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'user',
      'activation_key_user',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )  
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'user',
      'activation_key_user',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    )  
  }
};
