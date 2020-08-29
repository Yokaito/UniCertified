'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user',
     'total_hours_user',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: 'half_user'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('user',
      'total_hours_user'
    )
  }
};

