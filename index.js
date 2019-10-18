//importar express
const express = require('express')

//importar el router con las rutas
const routes = require('./routes')

//manejar los directorios del proyecto
const path = require('path')

//importar libreria para manejar datos enviados por formularios
const bodyParser = require('body-parser')

// const expressValidator = require('express-validator')

const flash = require('connect-flash')

//dependencias para manejar las sessiones
const session = require('express-session')
const cookieParser = require('cookie-parser')

//importar configuracion del passport
const passport = require('./config/passport')

//Importar conexion y configuracion de la base de datos
const db = require('./config/db')


//importar helpers
const Helpers = require('./helpers/helpers')

//Importar modelo sin necesidad de guardar en constantes
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
  .then(() => { console.log('Conectado al servidor') } )
  .catch(error => { console.log('error :', error) })

//creando servidor/aplicacion con express
const server = express()

//donde cargar los archivos estaticos(publicos)
server.use(express.static('public'))//indicar nombre de la carpeta

//habilitar Pug (template engine) al server
server.set('view engine', 'pug')

//habilitar bodyParser para leer datos enviados por formularios
server.use(bodyParser.urlencoded({extended:true}))

// server.use(expressValidator())

//agregar flash messages
server.use(flash())

server.use(cookieParser())

//configuracion del manejo de sesiones
server.use(session({
  secret: 'super_secreto', //firmar cookie
  //mantener la session activa aunque no tenga actividad
  resave: false, 
  saveUninitialized: false
}))

//inicializar passport
server.use(passport.initialize())
//contiene los metodos
server.use(passport.session())

//Pasar helper vardump a la aplicacion
//next como tercer parametro se refiere al middleware
server.use((req,res,next) => {
  
  //res.locals pasa variables a la aplicacion
  //el cual puede ser consumigo desde 
  //cualquier parte de la apliaccion
  res.locals.vardump = Helpers.vardump

  //variable globarl para los mensajes de flash
  res.locals.mensajes = req.flash()
 
  //el usuario se guarda en req.user
  //por lo que pasaremos ese usuario a una variable local
  //para asi conocer cual usuario esta inisiado
  res.locals.usuario = {...req.user} || null
  //next hace que el server pase a la siguente funcion
  //sino se coloca se quedara en la funcion actual
  next()
})

//agregar direcotorio para las vistas
//unir rutas con path.join siendo __dirname la ruta absoluta del proyecto,
//y la ruta de la carpeta que se desea acceder
server.set('views',path.join(__dirname,'./views'))


//agregar rutas importadas al servidor
server.use('/',routes())

//puerto por donde escuchara el servidor
server.listen(3500)