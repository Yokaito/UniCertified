'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'user',
      'picture_certified',
      {
        type: Sequelize.STRING(200),
        allowNull: true,
      }
    )  
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'user',
      'picture_certified',
      {
        type: Sequelize.BLOB,
        allowNull: true,
      }
    )  
  }
};
