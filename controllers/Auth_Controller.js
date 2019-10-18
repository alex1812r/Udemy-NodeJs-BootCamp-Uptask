const passport = require('passport')
const UsuariosModel = require('../models/Usuarios')
//libreria que servira para generar el token
const crypto = require('crypto')
//operaciones de sequalize para comparar
const Sequelize = require('sequelize')
const Op = Sequelize.Op
//importar dependencia para hashear los passwords
const bcrypt = require('bcrypt-nodejs')

const handlerEmail = require('../handlers/email')

exports.autenticarUsuario =  passport.authenticate('local',{
  //casos de si la validacion es correcta o no
  successRedirect: '/',
  failureRedirect: '/iniciar_sesion',
  failureFlash: true, //activar para pasar los mensajes a flash
  //mensaje por default que mandara flash cuando ambos campos esten vacios
  badRequestMessage: 'Ambos Campos son obligatorios' 
})

exports.usuarioAutenticado = (req, res, next) => {
  if(req.isAuthenticated()){
    return next()
  }
  return res.redirect('/iniciar_sesion')
}

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar_sesion')
  }) 
}


exports.enviarToken = async (req, res) => {
  const { email } = req.body
  const usuario = await UsuariosModel.findOne({ where: { email } })
    
    if(!usuario){
      req.flash('error', 'cuenta no existe')
      res.redirect('/reestablecer')
    }

    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000 //despues de una hora desde que se hace la peticion
    await usuario.save()    
      const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`
      //enviar correo mediante el handler importado
      await handlerEmail.enviarCorreo({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer_pass'
      })

    req.flash('correcto','se envio un mensaje a tu correo para restablecer la clave')
    res.redirect(`/iniciar_sesion`) 

}

exports.validarToken = async (req, res) => {
  const usuario = await UsuariosModel.findOne({where: { token: req.params.token }})
  if(!usuario){
    req.flash('error', 'No valido')
    res.redirect('/reestablecer')
  }

  res.render('reestablecer_Clave', {
    nombre: 'Reetablecer Clave'
  })
}

exports.actualizarPassword = async (req, res) => {
  //verificar el token sea valido y la fecha de expiracion
   const usuario = await UsuariosModel.findOne({ 
    where: { 
      token: req.params.token,
      //Op.gte compara si es mayor o igual 
      expiracion: { [Op.gte]: Date.now()}  
    }
  })

  if(!usuario){
    req.flash('error', 'No valido')
    req.redirect('/reestablecer')
  }
  //hashear nueva password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  usuario.token = null
  usuario.expiracion = null
  await usuario.save()
  req.flash('correcto', 'Tu password se ha actualizado')
  res.redirect('/iniciar_sesion')
}