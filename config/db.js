//Importar ORM sequelize 
const Sequelize = require('sequelize')

// Conectar con la base de datos ( DataBase, User, password )   
const db = new Sequelize('uptasknode', 'root', '123456', {
  host: 'localhost', // direccion de la base de datos
  dialect: 'mysql',// |'sqlite'|'postgres'|'mssql', //base de datos a utilizar
  port: 3306, //puerto 
  operatorsAliases: false,
  define: {
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

module.exports = db