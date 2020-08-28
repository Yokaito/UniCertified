'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('type_certified', 'first_hour', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          after: 'name_type_certified'
        }, { transaction: t }),

        queryInterface.addColumn('type_certified', 'second_hour', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          after: 'first_hour'
        }, { transaction: t }),

        queryInterface.addColumn('type_certified', 'third_hour', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          after: 'second_hour'
        }, { transaction: t })

      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('type_certified', 'first_hour', { transaction: t }),
        queryInterface.removeColumn('type_certified', 'second_hour', { transaction: t }),
        queryInterface.removeColumn('type_certified', 'third_hour', { transaction: t }),
      ]);
    })
  }
};