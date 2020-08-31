import express from 'express'
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars'
import path from 'path'
import cookie_parser from 'cookie-parser'
import session from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'

require('dotenv').config()

require('./database')

const app = express()

app.engine('handlebars', exphbs({
    defaultLayout: 'main',

    helpers:{
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    }
})) /* Define qual o layout main */
app.set('view engine', 'handlebars') /* Define o compilador sendo o handlebars */
app.set('views', path.join(__dirname, 'views')); /* Define as pastas das views  */
app.use(express.static(path.join(__dirname, 'public'))) /* Define quais sao as pastas publicas que podem ser acessadas */
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) /* Seta para retornar a informacao vinda do site como json */
app.use(cookie_parser()) /* Utilização do cookie */
app.use(session( /* Utilizar a session */
    { 
        secret: process.env.SS_SECRET, 
        name: process.env.SS_NAME,
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false, /* Funciona apenas quando é setado como https */
            httpOnly: true,
        }
    }
))
app.use(helmet()) /* Medidas de Seguranca */
app.use(morgan('dev'))

require('./controllers/index')(app)

app.use((req, res) => {
    res.status(404).render('404', {
        style: '404.css',
        title: 'UniCertified | 404',
    })
})

app.listen(process.env.PORT || 3000, () => { console.log(`Server foi iniciado na porta ${process.env.EXP_PORT}`)});