'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'certified',
      'comments_certified',
      {
        type: Sequelize.STRING(350),
        allowNull: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'certified',
      'comments_certified'
    )
  }
};