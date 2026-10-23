import { StyleGuidePage } from '@/dev/style-guide'
import { AppRouter } from '@/routes'

// La guía de estilos solo existe en desarrollo: /dev/style-guide
const showStyleGuide = import.meta.env.DEV && window.location.pathname === '/dev/style-guide'

function App() {
  return showStyleGuide ? <StyleGuidePage /> : <AppRouter />
}

export default App
