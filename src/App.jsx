import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Museums from './pages/Museums.jsx'
import ReserveTicket from './pages/ReserveTicket.jsx'
import Confirmation from './pages/Confirmation.jsx'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/museums" element={<Museums />} />
      <Route path="/reserve/:museumId" element={<ReserveTicket />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}><h1>Page Not Found</h1><a href="/">Go Home</a></div>} />
    </Routes>
  </BrowserRouter>
)

export default App