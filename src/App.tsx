import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { DesignSystem } from './pages/DesignSystem';
import { ToastProvider } from './components/ui/Toast';
import { CharNoise } from './components/CharNoise';
import { initAnalytics, trackPageview } from './lib/analytics';

function RouteTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    trackPageview(pathname + search);
  }, [pathname, search]);
  return null;
}

export default function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <RouteTracker />
        <CharNoise />
        <Routes>
          <Route path="/"               element={<Landing />} />
          <Route path="/design-system"  element={<DesignSystem />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
