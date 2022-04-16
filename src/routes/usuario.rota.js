const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const usuarioMid = require('../middleware/validarUsuario.middleware')

const {Usuario} = require('../db/models')


router.post('/', usuarioMid)
router.put('/', usuarioMid)

router.get('/', async (req, res) => {
    try {
        const usuario = await Usuario.findAll()
        res.json({usuarios: usuario})
    } catch (error) {
        console.log(error)
    }
    
})


router.get('/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id)
    res.json({usuarios: usuario})
})

router.put('/', async (req, res) => {
    const id = req.query.id
    const usuario = await Usuario.findByPk(id)
    if (usuario){
        usuario.email = req.body.email
        usuario.senha = req.body.senha
        await usuario.save()
        res.json({msg: "Usuario atualizado com sucesso!"})
    }else{
        res.status(400).json({msg: "Usuario não encontrado!"})
    }
})

router.delete('/', async (req, res) => {
    const id = req.query.id
    const usuario = await Usuario.findByPk(id)
    if (post){
        await usuario.destroy()
        res.json({msg: "Usuario deletado com sucesso!"})
    }else{
        res.status(400).json({msg: "Usuario não encontrado!"})
    }
})

router.post('/', async (req, res) => {
    const usuario = await Usuario.create(req.body)
    res.json({msg: `Usuario ${usuario.email} criado com sucesso`})    
})


module.exports = router