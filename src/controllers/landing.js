import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/login')
})

module.exports = app => app.use('/', router)