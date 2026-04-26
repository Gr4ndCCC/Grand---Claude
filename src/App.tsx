import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Landing }      from './pages/Landing';
import { Events }       from './pages/Events';
import { Vault }        from './pages/Vault';
import { Hosts }        from './pages/Hosts';
import { About }        from './pages/About';
import { FAQ }          from './pages/FAQ';
import { Board }        from './pages/Board';
import { Summit }       from './pages/Summit';
import { Council }      from './pages/Council';
import { Partners }     from './pages/Partners';
import { Network }      from './pages/Network';
import { initAnalytics, trackPageview } from './lib/analytics';

function RouteTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => { trackPageview(pathname + search); }, [pathname, search]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => { initAnalytics(); }, []);

  return (
    <BrowserRouter>
      <RouteTracker />
      <ScrollToTop />
      <Routes>
        <Route path="/"         element={<Landing />}  />
        <Route path="/events"   element={<Events />}   />
        <Route path="/vault"    element={<Vault />}    />
        <Route path="/hosts"    element={<Hosts />}    />
        <Route path="/about"    element={<About />}    />
        <Route path="/faq"      element={<FAQ />}      />
        <Route path="/board"    element={<Board />}    />
        <Route path="/summit"   element={<Summit />}   />
        <Route path="/council"  element={<Council />}  />
        <Route path="/partners" element={<Partners />} />
        <Route path="/network"  element={<Network />}  />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
