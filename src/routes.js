import express from 'express'

const routes = express.Router()

routes.get('/', (req, res) => {
    const users = ['Guilherme']

    return res.json({ users })
});


module.exports = routes