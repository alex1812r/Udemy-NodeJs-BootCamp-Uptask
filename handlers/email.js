//importar nodemailer para los envios de correo
const nodemailer = require('nodemailer')
//importar el tamplate engine (motor de plantillas) que se esta usando
const pug = require('pug')
//importar juice para agregar estilos lineales
const juice = require('juice')
//para convertir html a solo texto
const htmlToText = require('html-to-text')
const util = require('util')
const emailConfig = require('../config/email')

//forma la cual nodemailer manda correo, a travez de un transport
let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
})

//generar html
//el parametro opciones es la segunda opcion en caso de que
//no se pase ningun archivo
const generarHTML = (archivo, opciones = {}) => {
  //obtener html mediante la funcion de pug
  const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones)
  return juice(html) //retornar todo lineal
}

exports.enviarCorreo = async (opciones) => {
  const html = generarHTML(opciones.archivo, opciones)
  const text = htmlToText.fromString(html)
  let opcionesEmail = {
    from: 'Uptask Alex1812r 👻 <no-replay@uptask.com>', // sender address
    to: opciones.usuario.email, // list of receivers
    subject: opciones.subject, // Subject line
    text, // plain text body
    html  // html body
  }
  //forma no asincrona
  //transport.sendMail(mailOption)
  
  //usa util para que sendMail soporte la forma asincrona(async - await)
  const enviarEmail = util.promisify(transport.sendMail, transport)
  return enviarEmail.call(transport, opcionesEmail)

}