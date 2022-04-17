const express = require('express')
const rotaUsuario = require('./routes/usuario.rota')
const rotaPost = require('./routes/posts.rota')

var expressLayouts = require('express-ejs-layouts')

const indexRoute = require('./routes/index.rota')



const app = express()

app.use(express.json())
app.set('view engine', 'ejs')

app.set('layout', 'layouts/layout')

app.use(expressLayouts)

app.use('/static', express.static('public'))

app.use('/api/usuarios', rotaUsuario)
app.use('/api/posts', rotaPost)
app.use('/', indexRoute)



app.listen(8080, () => {
    console.log('Servidor pronto na porta 8080')
})