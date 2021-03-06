'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user',
      'half_user',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'course_user'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user',
      'half_user'
    )
  }
};
