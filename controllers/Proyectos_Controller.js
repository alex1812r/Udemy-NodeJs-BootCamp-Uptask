//Importar Modelo 
const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

//Exportar funciones para las rutas
//opcional usar funciones async await (recomendable)
exports.proyectosHome = async (req,res) => {
  const usuarioId = res.locals.usuario.id
  //Obtener todos los proyectos de la base de datos
  //del usuario iniciado
  const ProyectosTodos = await Proyectos.findAll({ where: { usuarioId } })  

  //las respuestas pueden ser de mensaje (send),
  //para renderizar (render), de tipo JSON (json)
  //render toma como parametros el nombre de la vista, y variables (opcional)
  res.render('index',{ 
    nombrePagina: 'BootCamp-UpTask',
    proyectos: ProyectosTodos
  })
}

exports.formularioProyecto = async (req,res) => {
  const usuarioId = res.locals.usuario.id
  //Obtener todos los proyectos de la base de datos
  const ProyectosTodos = await Proyectos.findAll({ where: { usuarioId } })  

  res.render('formulario_proyecto',{
    nombrePagina: 'Nuevo Proyecto',
    proyectos: ProyectosTodos
  })
}

//opcional usar funciones async await (recomendable)
exports.agregarProyecto = async (req,res) => {
  const usuarioId = res.locals.usuario.id
  //Obtener todos los proyectos de la base de datos
  const ProyectosTodos = await Proyectos.findAll({ where: { usuarioId } })  

  //console.log('req :', req.body)
  //validar nombre del proyecto
  const {nombre_proyecto} = req.body
  let errores = [] // arreglo para mandar errores

  //si error es nulo o vacio
  if(!nombre_proyecto){
    //agregar error del caso al arreglo de errores
    errores.push({msj:'agrega un nombre al proyecto'})
  }
  //si la longitud del arreglo de errores es mayor a 0
  if(errores.length){
    res.render('formulario_proyecto',{
      nombrePagina:'Nuevo Proyecto',
      proyectos: ProyectosTodos,
      errores
    })
  }else{
    //Crear registro en la base de datos 
    const usuarioId = res.locals.usuario.id
    /*FORMA NORMAL CON PROMISE
    Proyectos.create({
      nombre: nombre_proyecto, //campos de la tabla
      url
    })
    .then( () => console.log('Insercion realizada con exito') )
    .catch( error => console.log('error :', error) )
    /**/
    
    //FORMA CON ASYNC AWAIT
    await Proyectos.create({ nombre: nombre_proyecto , usuarioId})
    //una vez terminada la insercion redireccionar a la vista principal
    res.redirect('/')
  }
}

exports.proyectoPorUrl = async (req,res,next) => {
  /* FORMA INDEPENDIENTE DE CADA CONSULTA
  //Obtener todos los proyectos de la base de datos
  const ProyectosTodos = await Proyectos.findAll()
  
  const proyecto = await Proyectos.findOne({
    where: {
      //params para acceder a los parametros
      //pasados por la url
      url: req.params.url
    }
  })
  /**/

  //*FORMA ASINCRONA DE MANERA SIMULTANEA
  const usuarioId = res.locals.usuario.id
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } })  
  const proyectoPromise = Proyectos.findOne({ where: {url: req.params.url, usuarioId } })
  const [proyecto,ProyectosTodos] = await Promise.all([proyectoPromise, proyectosPromise]) 
  /**/
  // consultar tareas del proyecto
  const tareas = await Tareas.findAll({ 
    where: { 
      proyectoId: proyecto.id  
    },
    /*include se usa para combinar consultas similar a join
    include: [
      //modelo de tabla que va a combinar (hacer join)
      { model: Proyectos }
    ]
    /**/
  })

  //Si la busqueda es nula
  if(!proyecto){ return next() }

  //console.log('proyecto :', proyecto);

  res.render('tareas', {
    nombrePagina: 'Tareas del Proyecto',
    proyectos: ProyectosTodos,
    proyecto,
    tareas
  })
}

exports.formularioEditar = async (req,res) => {
  const usuarioId = res.locals.usuario.id
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } })
  const proyectoPromise = Proyectos.findOne({
    where: { id: req.params.id, usuarioId }
  })
  //funcion para que las busquedas de realizen de forma async await al mismo tiempo
  //es decir para que una  no deba esperar a que otra termine, sino que
  //el await estara a la espera de que ambas terminen
  const [ProyectosTodos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]) 

  res.render('formulario_proyecto',{
    nombrePagina: 'Editar Proyecto',
    proyectos: ProyectosTodos,
    proyecto
  })
}

exports.editarProyecto = async (req,res) => {
  const usuarioId = res.locals.usuario.id
  const ProyectosTodos = await Proyectos.findAll({ where: { usuarioId } })
  const {nombre_proyecto} = req.body
  let errores = []

  if(!nombre_proyecto){
    errores.push({msj:'agrega un nombre al proyecto'})
  }
  if(errores.length){
    res.render('formulario_proyecto',{
      nombrePagina:'Nuevo Proyecto',
      proyectos: ProyectosTodos,
      errores
    })
  }else{
    await Proyectos.update({ nombre: nombre_proyecto, usuarioId }, {where: { id: req.params.id }})
    res.redirect('/')
  }
}

exports.eliminarProyecto = async (req,res,next) => {
  const usuarioId = res.locals.usuario.id
  //req puede usar query o params
  const {urlProyecto} = req.query
  const resultado = await Proyectos.destroy({ where: { url: urlProyecto, usuarioId } })
  //se puede manejar el status de respuesta con la funcion status()
  if(!resultado){
    return next()
  }
  res.status(200).send('Proyecto Eliminado')
}