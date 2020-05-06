import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const users = ['Configurando o debugger da aplicação']

    return res.json({ users })
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});