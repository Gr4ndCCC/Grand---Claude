import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { DesignSystem } from './pages/DesignSystem';
import { ToastProvider } from './components/ui/Toast';
import { CharNoise } from './components/CharNoise';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
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
