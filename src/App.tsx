import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Events } from './pages/Events';
import { CreateEvent } from './pages/CreateEvent';
import { EventDetail } from './pages/EventDetail';
import { Profile } from './pages/Profile';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ember-bg">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — no nav */}
        <Route path="/" element={<Landing />} />

        {/* App routes — with nav */}
        <Route path="/events" element={
          <AppLayout><Events /></AppLayout>
        } />
        <Route path="/explore" element={
          <AppLayout><Events /></AppLayout>
        } />
        <Route path="/events/:id" element={
          <AppLayout><EventDetail /></AppLayout>
        } />
        <Route path="/create" element={
          <AppLayout><CreateEvent /></AppLayout>
        } />
        <Route path="/profile" element={
          <AppLayout><Profile /></AppLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
