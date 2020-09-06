"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("user", "flag_user", {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: "total_hours_user",
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("user", "flag_user");
  },
};
