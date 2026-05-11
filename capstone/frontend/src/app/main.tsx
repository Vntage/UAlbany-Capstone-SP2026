import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Landing from '../features/landing/pages/landingpage.tsx'
import Login from '../features/auth/pages/login.tsx'
import Signup from '../features/auth/pages/signup.tsx'
import { AuthProvider } from './AuthContext'
import Dashboard from '../features/dashboard/pages/dashboard.tsx'
import Alerts from '../features/alerts/pages/alerts.tsx'
import Budget from '../features/budget/pages/budget.tsx'
import Report from '../features/reports/pages/report.tsx'
import Settings from '../features/settings/pages/setting.tsx'
import Support from '../features/support/pages/support.tsx'
import Users from '../features/users/pages/users.tsx'
import TransactionsPage from '../features/transactions/pages/transactions.tsx'
import AdvancedAlert from '../features/alerts/pages/advancedAlert.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/*public routes*/}
          <Route path='/' element={<Landing/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          {/*protected routes (redirects to login page if auth returns no current user)*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/alerts" element={<Alerts/>}></Route>
            <Route path="/budget" element={<Budget/>}></Route>
            <Route path="/reports" element={<Report/>}></Route>
            <Route path="/transactions" element={<TransactionsPage/>}></Route>
            <Route path="/settings" element={<Settings/>}></Route>
            <Route path="/support" element={<Support/>}></Route>
            <Route path="/users" element={<Users/>}></Route>
            <Route path="/advancedAlerts" element={<AdvancedAlert/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
