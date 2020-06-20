import express from 'express'
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars'
import path from 'path'
import cookie_parser from 'cookie-parser'

require('./database')

const app = express()

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookie_parser())

require('./controllers/index')(app)

app.listen(3000, () => { console.log('App listening on port 3000!') });