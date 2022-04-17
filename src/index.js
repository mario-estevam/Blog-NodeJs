const express = require('express')
const rotaUsuario = require('./routes/usuario.rota')
const rotaPost = require('./routes/posts.rota')

var expressLayouts = require('express-ejs-layouts')

const indexRoute = require('./routes/index.rota')

const logger = require('./utils/logger')

const app = express()
const logMid = require('./middleware/log.mid')

app.use(express.json())
app.set('view engine', 'ejs')
app.use(logMid)


app.set('layout', 'layouts/layout')

app.use(expressLayouts)

app.use('/static', express.static('public'))

app.use('/api/usuarios', rotaUsuario)
app.use('/api/posts', rotaPost)
app.use('/', indexRoute)

app.use((err, req, res, next) => {
    const { statusCode, msg } = err
    res.status(statusCode).json({msg: msg})
})

app.listen(8080, () => {
    logger.info(`Iniciando no ambiente ${process.env.NODE_ENV}`)
    logger.info('Servidor pronto na porta 8080')
})
