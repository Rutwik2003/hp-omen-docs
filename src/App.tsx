import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ToastProvider } from './context/ToastContext';
import { DocsLayout, RootLayout } from './components/layout';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded Pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const DriversAndSoftware = lazy(() => import('./pages/DriversAndSoftware'));
const Contribute = lazy(() => import('./pages/Contribute'));
const NotFoundPage = lazy(() => import('./pages/ErrorPage').then(m => ({ default: m.NotFoundPage })));

// Dynamic Docs Loader
const DocsLoader = lazy(() => import('./pages/docs/DocsLoader'));

// Admin Components - Lazy loaded since they're not frequently accessed
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const GuideEditor = lazy(() => import('./pages/admin/GuideEditor'));
const SidebarConfigurator = lazy(() => import('./pages/admin/SidebarConfigurator'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <ScrollToTop />
          <RootLayout>
            <Suspense fallback={
              <div className="min-h-screen bg-black" />
            }>
              <Routes>
                {/* Custom Admin Panel */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="new" element={<GuideEditor />} />
                  <Route path="playground" element={<GuideEditor playground />} />
                  <Route path="edit/:id" element={<GuideEditor />} />
                  <Route path="sidebar" element={<SidebarConfigurator />} />
                </Route>

                {/* Home Route (No Sidebar) */}
                <Route path="/" element={<Home />} />

                {/* Public Guide Editor Routes (No Sidebar - Full Screen Editor) */}
                <Route path="/contribute/new" element={<GuideEditor mode="public" />} />
                <Route path="/contribute/playground" element={<GuideEditor mode="public" playground />} />
                <Route path="/contribute/edit/:id" element={<GuideEditor mode="public" />} />
              
              {/* Docs Routes (With Sidebar) */}
              <Route element={<DocsLayout><Outlet /></DocsLayout>}>
                {/* Migrated Routes -> Powered by JSON CMS */}
                <Route path="/quickstart" element={<DocsLoader category="quickstart" slug="quickstart" />} />
                <Route path="/windows" element={<DocsLoader category="windows" slug="windows" />} />
                <Route path="/linux" element={<DocsLoader category="linux" slug="linux" />} />
                <Route path="/hardware" element={<DocsLoader category="hardware" slug="hardware" />} />
                <Route path="/performance" element={<DocsLoader category="performance" slug="performance" />} />
                <Route path="/troubleshooting" element={<DocsLoader category="troubleshooting" slug="troubleshooting" />} />

                <Route path="/drivers" element={<DriversAndSoftware />} />
                <Route path="/contribute" element={<Contribute />} />

                {/* Dynamic Documentation Route (Fallback) */}
                <Route path="/docs/:category/:slug" element={<DocsLoader />} />
                
                {/* Redirect /docs to /quickstart */}
                <Route path="/docs" element={<Navigate to="/quickstart" replace />} />
              </Route>

              {/* 404 Catch-all Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </RootLayout>
      </ToastProvider>
    </Router>
  </ErrorBoundary>
  );
}

export default App;

