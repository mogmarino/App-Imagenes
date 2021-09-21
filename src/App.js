import React, { useEffect, useState } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';


function App() {

  // state de la app
  const [busqueda,guardarBusqueda] = useState('')
  const [imagenes,guardarImagenes] = useState([])
  const [paginaactual,guardarPaginaActual] = useState(1)
  const [totalpaginas,guardarTotalPaginas] = useState(1)


  useEffect(() => {

    const consultarAPI = async() =>{

      // evitamos la primer carga
      if (busqueda.trim() === '') return


      const imagenesPorPagina = 30
      const key = '23277539-93abd1327ec8c681f697ae38f'
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`

      const respuesta = await fetch(url)
      const resultado = await respuesta.json()

      // guardarBusqueda(resultado.hits)
      guardarImagenes(resultado.hits)

      // calcular la cantidad de paginas
      const calcularPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina)
      guardarTotalPaginas(calcularPaginas)

      // scroll hacia el top
      const jumbotron = document.querySelector('.jumbotron')
      jumbotron.scrollIntoView({behavior: 'smooth'})

    }

    consultarAPI()

    
  },[busqueda,paginaactual])

  // definir pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1

    if(nuevaPaginaActual === 0) return;

    guardarPaginaActual(nuevaPaginaActual)
  }

  // definir pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1

    if(nuevaPaginaActual > totalpaginas) return;

    guardarPaginaActual(nuevaPaginaActual)
  }

  return (
    <div className='container'>
      <div className='jumbotron'>
        <p className='lead text-center'>Buscador de imagenes</p>

        <Formulario 
          guardarBusqueda={guardarBusqueda}
        />
      </div>

      <div className='row justify-content-center'>
        <ListadoImagenes 
          imagenes={imagenes}
        />

        {(paginaactual === 1) ? null : (
          <button
            type='button'
            className='btn btn-info mr-1'
            onClick={paginaAnterior}
          >
            Anterior &laquo;
          </button>
        )}

        {(paginaactual === totalpaginas) ? null : (
            <button
              type='button'
              className='btn btn-info'
              onClick={paginaSiguiente}
            >
              Siguiente &raquo;
            </button>
        )}
        
      
      </div>
    </div>
  );
}

export default App;
