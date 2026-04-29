import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Landing }       from './pages/Landing';
import { Events }        from './pages/Events';
import { Vault }         from './pages/Vault';
import { Hosts }         from './pages/Hosts';
import { About }         from './pages/About';
import { FAQ }           from './pages/FAQ';
import { Board }         from './pages/Board';
import { Summit }        from './pages/Summit';
import { Council }       from './pages/Council';
import { Partners }      from './pages/Partners';
import { Network }       from './pages/Network';
import { Privacy }       from './pages/Privacy';
import { Terms }         from './pages/Terms';
import { Contact }       from './pages/Contact';
import { Account }       from './pages/Account';
import { Verify }        from './pages/Verify';
import { AuthProvider }  from './lib/auth';
import { AuthModal }     from './components/AuthModal';
import { CookieBanner }  from './components/CookieBanner';

function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => console.log('Route:', pathname), [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <RouteTracker />
        <ScrollToTop />
        <AuthModal />
        <CookieBanner />
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
          <Route path="/privacy"  element={<Privacy />}  />
          <Route path="/terms"    element={<Terms />}    />
          <Route path="/contact"  element={<Contact />}  />
          <Route path="/account"  element={<Account />}  />
          <Route path="/verify"   element={<Verify />}   />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
