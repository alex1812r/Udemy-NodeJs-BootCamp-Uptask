import Swal from "sweetalert2"

export const actualizarAvance = () => {
  //seleccionar tareas exitentes
  const tareas = document.querySelectorAll('li.tarea')

  if(tareas.length){
  //seleccionar tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo')
  //calcular avance
    //con Math.round se redondea el resultado en caso de tener decimales
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100)
  //motrar avance
    const porcentaje = document.querySelector('#porcentaje')
    porcentaje.style.width = avance+'%'

    if(avance == 100){
      Swal.fire(
      'PROYECTO FINALIZADO',
      'Felicidades has terminados tu tareas',
        'success'
    )}
  }

}