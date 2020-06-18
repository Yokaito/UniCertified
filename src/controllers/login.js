import express from 'express'
import user from '../models/user'
import type_user from '../models/type_user'

const router = express.Router()

router.get('/', (req, res) => {
    
    res.render('login', {
        style: 'login.css',
        title: 'Login Teste'      
    })
});

router.get('/lista', async (req, res) => { 
    // const type = await User.findAll({ include: [{
    //     model: type_user
    // }]})
    // .then(data => data.toJSON())
    let user = ''
    
    await User.findAll({ 
        where:{
            id: 1
        },
        include: [{ 
            model: type_user,
            attributes: ['name_type_user']
        }]
    }).then(data => { user = data[0] })

    console.log(user.type_user.name_type_user);
    
    
});

router.post('/auth', (req, res) => {
    let user = req.body
    console.log(user);

    res.redirect('/login')
    
})

module.exports = app => app.use('/login', router)