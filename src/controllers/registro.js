import express from 'express'

const router = express.Router()

/* Linkar a pagina de Login com a pagina de Registro ⚠️ */

router.get('/', (req, res) => {

    res.render('register', {
        style: 'login.css',
        js: 'formValidation.js',
        title: 'UniCertified | Cadastro'
    })
    
});


/* Criar o metodo de registro com email ⚠️ */

router.post('/registrar', (req, res) => {
    let user = req.body
    if(user.nome_usuario != ' ')
        console.log(true);


    if(user.nome_usuario.length < 4)
        console.log(true);
        
        
        
           
    res.sendStatus(202)
});


module.exports = app => app.use('/registro', router)

