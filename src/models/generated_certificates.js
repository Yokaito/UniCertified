const { Model, DataTypes } = require('sequelize')

class generated_certificates extends Model {
    static init(connection){
        super.init({
            value_generated_certificates: DataTypes.INTEGER,
            picture_generated_certificates: DataTypes.BLOB
        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign'})
        this.belongsTo(models.certified_generated, { foreignKey: 'id_certified_generated_foreign'})
    }
}

module.exports = generated_certificates