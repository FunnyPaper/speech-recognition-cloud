import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DemoPage from './pages/demo.page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DemoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
