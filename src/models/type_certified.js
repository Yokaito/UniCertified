const { Model, DataTypes } = require("sequelize");

class type_certified extends Model {
  static init(connection) {
    super.init(
      {
        name_type_certified: DataTypes.STRING,
      },
      {
        sequelize: connection,
      }
    );
  }
}

module.exports = type_certified;
