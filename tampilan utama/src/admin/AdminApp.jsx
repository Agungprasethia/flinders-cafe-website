import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import '../admin.css';

const queryClient = new QueryClient();

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('flinders_auth') === 'true'
  );

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('flinders_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="admin-scope">
            <Login onLogin={handleLogin} />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="admin-scope">
          <Dashboard onLogout={handleLogout} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
