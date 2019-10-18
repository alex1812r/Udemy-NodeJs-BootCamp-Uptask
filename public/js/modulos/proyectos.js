import Swal from 'sweetalert2'
import axios from 'axios'

const btbEliminar = document.querySelector('#eliminar-proyecto')

if(btbEliminar){
  btbEliminar.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl
    Swal.fire({
      title: 'Deseas eliminar este proyecto?',
      text: "Un proyecto eliminado no se puede recuperar",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
      cancelButtonText: 'No, Cancelar'
    })
    .then((result) => {
      if (result.value) {
        //enviar peticion a axios
        const url = `${location.origin}/proyecto/${urlProyecto}`
        
        axios.delete(url, {params: {urlProyecto}})
        .then(respuesta => {
          if(respuesta.status == 200){
            Swal.fire(
              'Eliminado!',
              respuesta.data,
              'success'
            )
            setTimeout(()=>{
              window.location.href = "/"
            },3000)
          }
        })
        .catch(()=>{
          Swal.fire({
            type: 'error',
            title: 'Hubo un Error',
            text: 'No se pudo eliminar el proyecto' 
          })
        })
        return;
       
      }
    })
  })
}

export default btbEliminar