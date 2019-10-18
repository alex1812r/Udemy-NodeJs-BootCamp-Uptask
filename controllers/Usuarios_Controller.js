const Usuarios = require('../models/Usuarios')
const handlerEmail = require('../handlers/email')

exports.formCrearCuenta = (req,res) => {
  res.render('formulario_usuario',{
    nombrePagina: 'Crear Cuenta en Uptask'
  })
}

exports.crearCuenta = async (req, res) => {
  const { email, password} = req.body

  await Usuarios.create({
    email,
    password
  })
    .then( async () => {
      //Creanto url para confirmar correo
      const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
      //objeto para enviar a la funcion "enviar correo"
      const usuario = { email }
      await handlerEmail.enviarCorreo({
        usuario,
        subject: 'Confirma tu cuenta Uptask',
        confirmarUrl ,
        archivo: 'confirmar_cuenta'
      })
      req.flash('correcto', 'se envio un correo, verifica tu cuenta')
      res.redirect('/iniciar_sesion')  
    })
    .catch( error => {
      req.flash('error', error.errors.map(error => error.message))
      res.render('formulario_usuario',{
        nombrePagina: 'Crear Cuenta en Uptask',
        mensajes: req.flash(),
        email,
        password,
      })

    })

}

exports.formLogin = (req, res) => {
  const { error } = res.locals.mensajes
  res.render('formulario_login', {
    nombrePagina: 'Iniciar Sesion en Uptask',
    error
  })
}

exports.formReestablecer = (req, res) => {
  res.render('formulario_reestablecer', {
    nombrePagina: 'Reestablecer Clave'
  })
}

exports.confirmarCuenta = async (req, res) => {
  const email= req.params.email
  const usuario = await Usuarios.findOne({
    where: {
      email 
    }
  })
  if(!usuario){
    //console.log(usuario)
    req.flash('error', 'no valido')
    res.redirect('/crear_cuenta')

  }else{
    usuario.activo
    await usuario.save()
    
    req.flash('correcto', 'Cuenta Activada')
    res.redirect('/iniciar_sesion')
  }
}