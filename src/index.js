const express = require('express')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api.yaml');
const helmet = require('helmet');
var expressLayouts = require('express-ejs-layouts')
//rotas
const rotaUsuario = require('./routes/usuario.rota')
const rotaPost = require('./routes/posts.rota')
const indexRoute = require('./routes/index.rota')
//
const logger = require('./utils/logger')
const logMid = require('./middleware/log.mid')

const app = express()
app.use(helmet())




require('dotenv').config()
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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



const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    logger.info(`Iniciando no ambiente ${process.env.NODE_ENV}`)
    logger.info(`Servidor pronto na porta ${PORT}`)
})