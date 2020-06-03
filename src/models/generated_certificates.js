const { Model, DataTypes } = require('sequelize')

class generated_certificates extends Model {
    static init(connection){
        super.init({
            id_generated_certificates: DataTypes.INTEGER,
            value_generated_certificates: DataTypes.INTEGER,
            picture_generated_certificates: DataTypes.BLOB
        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign', as: 'generated certificate has user'})
        this.belongsTo(models.certified_generated, { foreignKey: 'id_certified_generated', as: 'generated certificate has certified generated' })
    }
}

module.exports = generated_certificates