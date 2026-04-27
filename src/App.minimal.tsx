import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Events } from './pages/Events';
import { Vault } from './pages/Vault';
import { Hosts } from './pages/Hosts';
import { FAQ } from './pages/FAQ';

function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => console.log('Route:', pathname), [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/hosts" element={<Hosts />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
