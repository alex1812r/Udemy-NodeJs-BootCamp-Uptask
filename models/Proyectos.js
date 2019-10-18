//importar el ORM Sequilize 
const Sequelize = require('sequelize')
//importar la conexion y configuracion hacia la base de datos
const db = require('../config/db')
//Importar Slug para manejar la creacion de las urls
const Slug = require('slug')
//importar shortId para los ID de las url
const ShortId = require('shortid')

//Definiendo tablas para la base de datos
const Proyectos = db.define('proyectos',{
  //campos para la base de datos
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  //en caso de solo el tipo de dato 
  //no es necesario pasarle un objecto
  nombre: Sequelize.STRING,
  url: Sequelize.STRING

}, { //como segundo parametros se pasan las opcciones

  //los hooks son funciones que se realizaran 
  //antes de crear el registro
  hooks: {
    //tiene como parametros los datos que van a ser insertados
    beforeCreate(proyecto) {
      console.log('BEFORE : ', proyecto)
      //crear url para el registro con Slug
      const url = Slug(proyecto.nombre).toLowerCase() //convertir todo en minusculas
      //guardar en el objeto que se va insertar la url 
      proyecto.url = `${url}-${ShortId.generate()}`
      console.log('AFTER :', proyecto)
    }
  }
})

module.exports = Proyectos