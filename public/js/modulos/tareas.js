import Axios from "axios"
import Swal from "sweetalert2"
import { actualizarAvance } from '../funciones/avance'

const tareas = document.querySelector('.listado-pendientes')

if(tareas){
  tareas.addEventListener('click', e => {
    if(e.target.classList.contains('fa-check-circle')){
      const icono = e.target
      //acceder al elemento li y dentro con 'dataset'
      //acceder a los atributos personalizados
      //segudo de el nombre que se le alla dado (tarea)
      const idTarea = icono.parentElement.parentElement.dataset.tarea
      
      const url = `${location.origin}/tareas/${idTarea}`
      Axios.patch(url, { idTarea })
        .then(function (response){
          if(response.status == 200){
            icono.classList.toggle('completo')
            actualizarAvance()
          }
        })
        .catch(function (error){
          console.log(error)
        })
    }

    if(e.target.classList.contains('fa-trash')){
      const html = e.target.parentElement.parentElement 
      const idTarea = html.dataset.tarea

      Swal.fire({
        title: 'Deseas eliminar esta tarea?',
        text: "Una tarea eliminada no se puede recuperar",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar!',
        cancelButtonText: 'No, Cancelar'
      }) .then((result) => {
        if(result.value){
          const url = `${location.origin}/tareas/${idTarea}`
          //delete require que pase por params
          Axios.delete(url, {
            params: { idTarea }
          })
            .then(function(respuesta){
              if(respuesta.status == 200){
                //eliminar nodo HTML
                html.parentElement.removeChild(html)
                Swal.fire('Tarea Eliminada', respuesta.data, 'success')
                actualizarAvance()
              }
            })

        }
      })

    }
  })
}