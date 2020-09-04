"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("history_certified", "type_user", {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: "id_type_action_foreign",
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("history_certified", "type_user");
  },
};
