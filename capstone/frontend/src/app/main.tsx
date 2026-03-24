import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Landing from '../features/landing/pages/landingpage.tsx'
import Login from '../features/auth/pages/login.tsx'
import Signup from '../features/auth/pages/signup.tsx'
import { AuthProvider } from './AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element= {<Landing/>}></Route>
          <Route path="/Login" element= {<Login/>}></Route>
          <Route path="/Signup" element= {<Signup/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
