const sequelize = require('sequelize')
const dbConfig = require('../config/database')

const activation_state = require('../models/activation_state')
const type_user = require('../models/type_user')
const state = require('../models/state')
const type_action = require('../models/type_action')
const type_certified = require('../models/type_certified')
const user = require('../models/user')
const history_user = require('../models/history_user')
const certified = require('../models/certified')
const history_certified = require('../models/history_certified')
const model_certified = require('../models/model_certified')
const certified_generated = require('../models/certified_generated')
const generated_certificates = require('../models/generated_certificates')

const connection = new sequelize(dbConfig)

activation_state.init(connection)
type_user.init(connection)
state.init(connection)
type_action.init(connection)
type_certified.init(connection)
user.init(connection)
history_user.init(connection)
certified.init(connection)
history_certified.init(connection)
model_certified.init(connection)
certified_generated.init(connection)
generated_certificates.init(connection)

user.associate(connection.models)

module.exports = connection