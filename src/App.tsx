import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Landing }      from './pages/Landing';
import { Events }       from './pages/Events';
import { Vault }        from './pages/Vault';
import { Hosts }        from './pages/Hosts';
import { About }        from './pages/About';
import { FAQ }          from './pages/FAQ';
import { initAnalytics, trackPageview } from './lib/analytics';

function RouteTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => { trackPageview(pathname + search); }, [pathname, search]);
  return null;
}

export default function App() {
  useEffect(() => { initAnalytics(); }, []);

  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/"       element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/vault"  element={<Vault />} />
        <Route path="/hosts"  element={<Hosts />} />
        <Route path="/about"  element={<About />} />
        <Route path="/faq"    element={<FAQ />} />
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
