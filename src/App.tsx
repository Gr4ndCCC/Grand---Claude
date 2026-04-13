import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing }     from './pages/Landing';
import { Events }      from './pages/Events';
import { Vault }       from './pages/Vault';
import { Hosts }       from './pages/Hosts';
import { About }       from './pages/About';
import { FAQ }         from './pages/FAQ';
import { EventDetail } from './pages/EventDetail';
import { CreateEvent } from './pages/CreateEvent';
import { Profile }     from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Landing />}     />
        <Route path="/events"     element={<Events />}      />
        <Route path="/vault"      element={<Vault />}       />
        <Route path="/hosts"      element={<Hosts />}       />
        <Route path="/about"      element={<About />}       />
        <Route path="/faq"        element={<FAQ />}         />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/create"     element={<CreateEvent />} />
        <Route path="/profile"    element={<Profile />}     />
        <Route path="/explore"    element={<Events />}      />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
