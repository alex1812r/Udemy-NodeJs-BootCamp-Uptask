//Importar passport para las validaciones de usuarios
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//Referencia al modelo que se va a autenticar
const Usuarios = require('../models/Usuarios')

// local -strategy - login con creedenciales propias (email y password)
passport.use(
  new LocalStrategy(
    //por default passport espera un usuario y password
    {
      usernameField: 'email',//como indica el modelo
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({ where: { email, activo: 1 } })
        //en caso si el usuario existe
        //si el password es incorrecto
        if(!usuario.verificarPassword(password)){
          return done(null, false, { 
            message: 'Password Incorrecto'
          })
        }
        return done(null, usuario)

      } catch (error) {
        //en caso de que el usuario no exista
        return done(null, false, {
          message: 'Esa cuenta no existe'
        })
      
      }
    }

  )
)

//serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario)
})

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario)
})

module.exports = passport