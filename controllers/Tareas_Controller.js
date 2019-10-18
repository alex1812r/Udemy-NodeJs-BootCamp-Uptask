const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.agregarTarea = async (req,res,next) => {
  const Proyecto = await Proyectos.findOne({ where: { url: req.params.url } })
  const {tarea} = req.body
  const resultado = await Tareas.create({
    tarea,
    estado: 0,
    proyectoId: Proyecto.id 
  })
  if(!resultado){
    return next()
  }

  res.redirect(`/proyecto/${req.params.url}`)
}

exports.cambiarEstadoTarea = async (req,res,next) => {
  const { id } = req.params
  const tarea =  await Tareas.findOne({ where: { id } }) 
  tarea.estado = tarea.estado ? false : true
  const resultado = tarea.save()
  if(!resultado){
    return next()
  }
  res.status(200).send('all fine...')
}

exports.eliminarTarea = async (req, res) => {
  const { id } = req.params
  const resultado = await Tareas.destroy({ where: { id } })
  if(!resultado) return next()
  res.status(200).send('Tarea Eliminada')
}