import express from 'express'

const router = express.Router()

router.use((req, res, next) => {
    if(!req.session.user){
        res.redirect('/login')
    }else{
        next()
    }
    
})

router.get('/', (req, res) => {
    res.send(req.session.user.nome)
})

router.get('/teste', (req, res) => {
    res.send('teste')
})

module.exports = app => app.use('/dashboard', router)