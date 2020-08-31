import express from 'express'
import Certified from '../models/certified'
import User from '../models/user'
import { Op, DataTypes } from 'sequelize'

const router = express.Router()

router.use((req, res, next) => {
    if(!req.session.user){
        res.redirect('/login')
    }else if(req.session.user.tipo_usuario <= 2){
        next()
    }else{
        res.redirect('/dashboard')
    }    
})

router.get('/', (req, res) => {
    res.render('estatisticas', {
        js: 'controllers_js/estatisticas.js',
        style: 'controllers_css/dashboard.css',
        title: 'UniCertified | Estatistica',
        user: req.session.user,
        breadcrumb: `Estatistica`,
    }) 
})

router.post('/datac', async (req, res) => {
    var date = new Date()
    var year = date.getFullYear();
    var mes_dias = []

    for (let i = 0; i <= 11; i++) {
        mes_dias.push((new Date(year, i + 1, 0).getDate()))  /* Ultimo dia de cada mes do ano */      
    }

    const { count, rows } = await Certified.findAndCountAll({
        where: {
            created_at: {
                [Op.between]: [`${year}-01-01`, `${year}-12-31`]
            }
        },
        order: [
            ['created_at', 'ASC']
        ]
    })

    var soma_certificado = []
    for (let mes = 0; mes <= 11; mes++) {
        soma_certificado[mes] = null    
    }

    rows.forEach(e => { 
        for (let mes = 0; mes <= 11; mes++) {    
            if(e.createdAt.getMonth() == mes){
                soma_certificado[mes] += 1
            }
        }    
    })

    res.send({ data: soma_certificado })
    
    
})

router.post('/datau', async (req, res) => {
    var date = new Date()
    var year = date.getFullYear()

    const { count, rows } = await User.findAndCountAll({
        where: {
            created_at: {
                [Op.between]: [`${year}-01-01`, `${year}-12-31`]
            }            
        },
        order: [
            ['created_at', 'ASC']
        ]
    })

    var soma_aluno = []
    for (let mes = 0; mes <= 11; mes++) {
        soma_aluno[mes] = null  
    }

    rows.forEach(e => {
        for(let mes = 0; mes <= 11; mes++){
            if(e.createdAt.getMonth() == mes){
                soma_aluno[mes] += 1
            }
        }
    })

    res.send({ data: soma_aluno })
})

module.exports = app => app.use('/admin/estatisticas', router)