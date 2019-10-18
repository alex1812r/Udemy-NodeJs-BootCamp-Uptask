const express = require('express')
//router que maneja las rutas
const router = express.Router()

//Importar express-validator
const { body } = require('express-validator/check')

const proyectos_Controller = require('../controllers/Proyectos_Controller')
const tareas_controller = require('../controllers/Tareas_Controller')
const usuarios_controller = require('../controllers/Usuarios_Controller')
const auth_controller = require('../controllers/Auth_Controller')

//exportar el router
module.exports = function(){
  //*RUTAS PARA EL MANEJO DE LOS PROYECTOS

  //rutas pueden ser get, post, put o patch
  router.get('/' ,
    //controlador que pasa antes de la pagina principal
    //es decir que realiza la funcion para verificar
    //si existe un usuario autenticado (inicio sesion)
    auth_controller.usuarioAutenticado,
    proyectos_Controller.proyectosHome
  )

  router.get('/nuevo_proyecto',
    auth_controller.usuarioAutenticado,  
    proyectos_Controller.formularioProyecto
  )

  router.post('/nuevo_proyecto/:id',
    auth_controller.usuarioAutenticado, 
    body('nombre_proyecto').not().isEmpty().trim().escape(),
    proyectos_Controller.editarProyecto)

  router.post(
    '/nuevo_proyecto',
    auth_controller.usuarioAutenticado,
    //body recibe los parametros pasado
    //isEmpty valida si la cadena esta vacia
    //trim limpia los espacios al princio y final de la cadena de texto
    //escape corrige los problemas con los caracteres extraños
    body('nombre_proyecto').not().isEmpty().trim().escape(),
    proyectos_Controller.agregarProyecto
  )

  router.get('/proyecto/:url',
    auth_controller.usuarioAutenticado,  
    proyectos_Controller.proyectoPorUrl
  )

  router.get('/proyecto/editar/:id',
    auth_controller.usuarioAutenticado,
    proyectos_Controller.formularioEditar
  )

  router.delete('/proyecto/:url', 
    auth_controller.usuarioAutenticado,
    proyectos_Controller.eliminarProyecto
  )
  
  router.post('/proyecto/:url',
  auth_controller.usuarioAutenticado, 
  tareas_controller.agregarTarea
  )
  /**/
  
  //* RUTAS PARA EL MANEJO DE TAREAS
    
  //patch es parecido a put, con la diferencia de que patch
  //solo actualiza una porcion del registro, a diferencia de put
  //que lo actualiza completo
  router.patch('/tareas/:id', 
  auth_controller.usuarioAutenticado,
  tareas_controller.cambiarEstadoTarea
  )
  
  router.delete('/tareas/:id', 
  auth_controller.usuarioAutenticado,
  tareas_controller.eliminarTarea
  )
  /**/
  
  //*RUTAS PARA LA CREACION DE CUENTAS DE USUARIO
  router.get('/crear_cuenta', usuarios_controller.formCrearCuenta )
  router.post('/crear_cuenta', usuarios_controller.crearCuenta)
  router.get('/confirmar/:email', usuarios_controller.confirmarCuenta)
  /**/
  
  //RUTAS PARA EL MANEJO DE SESIONES
  router.get('/iniciar_sesion', usuarios_controller.formLogin)
  router.post('/iniciar_sesion', auth_controller.autenticarUsuario)
  router.get('/cerrar_sesion', auth_controller.cerrarSesion)
  
  router.get('/reestablecer', usuarios_controller.formReestablecer)
  router.post('/reestablecer' , auth_controller.enviarToken)
  router.get('/reestablecer/:token', auth_controller.validarToken)
  router.post('/reestablecer/:token', auth_controller.actualizarPassword)
  return router 
}
