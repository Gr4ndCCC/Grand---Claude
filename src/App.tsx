import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Landing }        from './pages/Landing';
import { Events }         from './pages/Events';
import { Vault }          from './pages/Vault';
import { Hosts }          from './pages/Hosts';
import { About }          from './pages/About';
import { FAQ }            from './pages/FAQ';
import { Board }          from './pages/Board';
import { Summit }         from './pages/Summit';
import { Council }        from './pages/Council';
import { Partners }       from './pages/Partners';
import { Network }        from './pages/Network';
import { Privacy }        from './pages/Privacy';
import { Terms }          from './pages/Terms';
import { Contact }        from './pages/Contact';
import { EventDetail }    from './pages/EventDetail';
import { HostNew }        from './pages/HostNew';
import { Account }        from './pages/Account';
import { VaultCheckout }  from './pages/VaultCheckout';
import { AuthProvider }   from './lib/auth';
import { AuthModal }      from './components/AuthModal';

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
      <BrowserRouter>
        <RouteTracker />
        <ScrollToTop />
        <AuthModal />
        <Routes>
          <Route path="/"                 element={<Landing />}       />
          <Route path="/events"           element={<Events />}        />
          <Route path="/events/:id"       element={<EventDetail />}   />
          <Route path="/vault"            element={<Vault />}         />
          <Route path="/vault/checkout"   element={<VaultCheckout />} />
          <Route path="/hosts"            element={<Hosts />}         />
          <Route path="/hosts/new"        element={<HostNew />}       />
          <Route path="/account"          element={<Account />}       />
          <Route path="/about"            element={<About />}         />
          <Route path="/faq"              element={<FAQ />}           />
          <Route path="/board"            element={<Board />}         />
          <Route path="/summit"           element={<Summit />}        />
          <Route path="/council"          element={<Council />}       />
          <Route path="/partners"         element={<Partners />}      />
          <Route path="/network"          element={<Network />}       />
          <Route path="/privacy"          element={<Privacy />}       />
          <Route path="/terms"            element={<Terms />}         />
          <Route path="/contact"          element={<Contact />}       />
          <Route path="*"                 element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
