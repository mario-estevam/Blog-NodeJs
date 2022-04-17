const express = require('express')
const router = express.Router()
const path = require('path')

const postMid = require('../middleware/validarPost.middleware')
const { Post, Usuario } = require('../db/models')
var  multer   =  require ( 'multer' ) 


var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads')
        },
        filename: function (req, file, cb) {
             cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)) 
        }
})

const fileFilter = (req, file, cb) => {
        const extensoes = /jpeg|jpg|png/i
        if (extensoes.test(path.extname(file.originalname))){
                cb(null, true)
        }else{
                return cb('Arquivo não suportado. Apenas jpg e jpeg são suportados.')
        }
}

var upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/', postMid)
router.put('/', postMid)

router.get('/', async (req, res) => {
        const posts = await Post.findAll()
        res.json({posts: posts})
})

router.get('/:id', async (req, res) => {
        const post = await Post.findByPk(req.params.id, 
                {include: [{model: Usuario}], raw: true, nest: true})

        const postProcessado = prepararResultado(post)

        res.json({posts: postProcessado})
})

router.post('/', async (req, res) => {
        const post = await Post.create(req.body)
        res.json({msg: "Post adicionado com sucesso!"})
})

router.post('/upload', upload . single ( 'foto' ), async (req, res) => {
    console.log(req.file)
    res.json({msg: 'Arquivo enviado com sucesso'})
})

router.delete('/', async (req, res) => {
        const id = req.query.id
        const post = await Post.findByPk(id)
        if (post){
                await post.destroy()
                res.json({msg: "Post deletado com sucesso!"})
        }else{
                res.status(400).json({msg: "Post não encontrado!"})
        }
})

router.put('/', async (req, res) => {

        const id = req.query.id
        const post = await Post.findByPk(id)

        if (post){
                post.titulo = req.body.titulo
                post.texto = req.body.texto
                await post.save()
                res.json({msg: "Post atualizado com sucesso!"})
        }else{
                res.status(400).json({msg: "Post não encontrado!"})
        }

})

function prepararResultado(post){
        const result = Object.assign({}, post)

        if (result.createdAt) delete result.createdAt
        if (result.updatedAt) delete result.updatedAt
        if (result.userId) delete result.userId
        if (result.Usuario){
            delete result.Usuario.senha
            delete result.Usuario.createdAt
            delete result.Usuario.updatedAt
        }
        return result
}

module.exports = router