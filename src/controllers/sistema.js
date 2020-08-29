import express from 'express'
import variables, { count } from '../models/variables'
import formatarData from '../functions/formatDate'

require('dotenv').config()

const router = express.Router()


router.use((req, res, next) => {
    if(!req.session.user){
        res.redirect('/login')
    }else if(req.session.user.tipo_usuario <= 1){
        next()
    }else{
        res.redirect('/dashboard')
    }    
})

router.get('/variaveis', async (req, res) => {
    var variaveisAll
    var status = []
    await variables.findAll().then(r => {
        if(r){
            variaveisAll = r.map(v => {
                return Object.assign({},{
                    id: v.id,
                    nome: v.name_variable,
                    valor: v.value_variable,
                    criada: formatarData(v.updatedAt),
                    atualizada: formatarData(v.updatedAt)                  
                })
            })
        }else{
            status.push({ msg: 'Nenhuma variavel encontrada' })
        }
    })

    res.render('variaveis', {
        js: 'controllers_js/variaveis.js',
        style: 'controllers_css/dashboard.css',
        title: 'UniCertified | Variaveis',
        user: req.session.user,
        breadcrumb: 'Variaveis',
        variaveis: variaveisAll,
        status
    })
})

router.post('/variaveis/editarvariavel', async (req, res) => {
    var {id, nome, valor} = req.body
    var count_error = 0

    if(!(id != ' '))
        count_error += 1
    if(!(nome != ' ') && !(nome.length >= 5 && nome.length <= 50))
        count_error += 1
    if(!(valor != ' ') && !(valor >= 1 && valor <= 1000))
        count_error += 1

    if(count_error != 0)
        res.send({ error : 'Ocorreu um erro com os dados enviados'})
    else{
        await variables.findOne({
            where: {
                id: id
            }
        }).then(r => {
            if(r){
                r.update({
                    name_variable: nome,
                    value_variable: valor
                }).then(ru => {
                    if(ru)
                        res.send({ success: 'Variavel atualizada com sucesso' })
                    else
                        res.send({ error: 'Ocorreu um erro ao atualizar a variavel'})
                })
            }else{
                res.send({ error: 'Variavel não encontrada'})
            }
        })
    }
})

module.exports = app => app.use('/sistema', router)