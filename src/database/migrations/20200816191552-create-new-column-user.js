'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user',
      'course_user',
      {
        type: Sequelize.STRING(50),
        allowNull: true,
        after: 'password_user'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user',
      'course_user'
    )
  }
};
