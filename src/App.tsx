import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Presentation from './pages/Presentation/Presentation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/presentation' element={<Presentation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
