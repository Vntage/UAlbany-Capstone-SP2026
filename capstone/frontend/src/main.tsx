import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.tsx'
import Login from './pages/login.tsx'
import Signup from './pages/signup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<App/>}></Route>
        <Route path="/Login" element= {<Login/>}></Route>
        <Route path="/Signup" element= {<Signup/>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
