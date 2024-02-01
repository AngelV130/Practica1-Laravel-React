export default function ErrorPage({ status }) {
    const title = {
      503: '503: Servicio no disponible',
      500: '500: Error del servidor',
      404: '404: Página no encontrada',
      403: '403: Prohibido',
      419: '419: Página expirada',
    }[status] || status+': Error';
    
    const description = {
      503: 'Lo siento, estamos realizando mantenimiento. Por favor, vuelva pronto.',
      500: 'Oops, algo salió mal en nuestros servidores.',
      404: 'Lo siento, la página que estás buscando no pudo ser encontrada.',
      403: 'Lo siento, no tienes permitido acceder a la página.',
      419: 'La página ha expirado, por favor inténtalo de nuevo.',
    }[status] || 'Se produjo un error en el servidor.';
  
    return (
      <>
        {
          status 
          && 
          <div className="text-red-500 mb-2">
            <h1>{title}</h1>
            <div>{description}</div>
          </div>
        }
      </>
    )
  }