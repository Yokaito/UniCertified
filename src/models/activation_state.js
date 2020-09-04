const { Model, DataTypes } = require("sequelize");

class activation_state extends Model {
  static init(connection) {
    super.init(
      {
        name_activation_state: DataTypes.STRING,
      },
      {
        sequelize: connection,
      }
    );
  }
}

module.exports = activation_state;
