const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const usuarioMid = require('../middleware/validarUsuario.middleware')
const bcrypt = require('bcrypt');
const {Usuario} = require('../db/models')
const jwt = require("jsonwebtoken");

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


router.post("/login", async (req, res) => {

    const email = req.body.email;
    const senha = req.body.senha;
  
    const usuario = await Usuario.findOne({
      where: {
        email: email,
      },
    });
  
    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      const payload = {
        sub: usuario.id,
        iss: "imd-backend",
        aud: "imd-frontend",
        email: usuario.email,
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '40s'})
      res.json({ accessToken: token })
    } else {
      res.status(403).json({ msg: "usuário ou senha inválidos" })
    }
  });


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

router.post("/", async (req, res) => {
    const senha = req.body.senha;
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    const usuario = { email: req.body.email, senha: senhaCriptografada };
    const usuarioObj = await Usuario.create(usuario);
    res.json({ msg: "Usuário adicionado com sucesso!", userId: usuarioObj.id });
  })


module.exports = router