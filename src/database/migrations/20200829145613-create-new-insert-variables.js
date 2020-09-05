"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("variables", [
      {
        name_variable: "Semestre 1",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name_variable: "Semestre 2",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name_variable: "Semestre 3",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name_variable: "Semestre 4",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name_variable: "Semestre 5",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name_variable: "Semestre 6",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name_variable: "Semestre 7",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name_variable: "Semestre 8",
        value_variable: 240,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("variables", null, {});
  },
};
