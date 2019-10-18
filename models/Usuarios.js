const Sequelize = require('sequelize')
const db = require('../config/db')
const Proyectos = require('../models/Proyectos')
//importar dependencia para hashear los passwords
const bcrypt = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios',{
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING(60),
    allowNull: false, // el campo no puede ser nulo
    //validar mediante sequelize
    validate: {
      //valida si es de tipo email
      isEmail: {
        msg: 'agrega un correo valido'//mensaje que mostrara en caso de error
      },
      notEmpty: {
        msg: 'El email no puede estar vacio'
      }
    },
    //validar que el registro sea unico (no repita emails)
    unique: {
      args: true,
      msg: 'Usuario ya registrado'
    }

  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      //valida que no este vacio
      notEmpty: {
        msg: 'El password no puede estar vacio'
      }
    }
  },

  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  },
  token: Sequelize.STRING,
  expiracion: Sequelize.DATE

}, {
  hooks: {
    beforeCreate(usuario) {
      //hashear password antes de crear el usuario
      usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
    },
  }
})

//Metodos perzonalisados
//prototype agrega funcionalidades al modelo
Usuarios.prototype.verificarPassword = function (password) {
  //comparando password con la de la base de datos
  //siendo this.password el de la base de datos
  return bcrypt.compareSync(password, this.password)
}

//Asociar usuarios a proyectos con relacion de
//uno a muchos (un usuario puede crear muchos proyectos)
Usuarios.hasMany(Proyectos)

module.exports = Usuarios
