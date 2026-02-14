import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatInterface } from '@/components/ChatInterface';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { LegalAidPage } from '@/pages/LegalAidPage';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

import { ProtectedRoute } from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/resources" element={
                  <ProtectedRoute>
                    <ResourcesPage />
                  </ProtectedRoute>
                } />
                <Route path="/templates" element={
                  <ProtectedRoute>
                    <TemplatesPage />
                  </ProtectedRoute>
                } />
                <Route path="/legal-aid" element={
                  <ProtectedRoute>
                    <LegalAidPage />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Routes>
            </Layout>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
