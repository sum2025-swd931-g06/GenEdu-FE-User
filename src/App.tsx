import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Presentation from './pages/Presentation/Presentation'
import UserProfile from './pages/UserProfile'
import ProjectDetail from './pages/ProjectDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/presentation' element={<Presentation />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/project/:id' element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
