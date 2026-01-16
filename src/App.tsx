import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import RootLayout from './components/RootLayout';
import DocsLayout from './components/DocsLayout';
import ScrollToTop from './components/ScrollToTop';

// Pages
// Pages
import Home from './pages/Home';
import DriversAndSoftware from './pages/DriversAndSoftware';
import Contribute from './pages/Contribute';

// Dynamic Docs Loader
import DocsLoader from './pages/docs/DocsLoader';

// Admin Components
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import GuideEditor from './pages/admin/GuideEditor';

function App() {
  return (
    <Router>
      <ToastProvider>
        <ScrollToTop />
        <RootLayout>
          <Routes>
            {/* Custom Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="new" element={<GuideEditor />} />
              <Route path="playground" element={<GuideEditor playground />} />
              <Route path="edit/:id" element={<GuideEditor />} />
            </Route>

            {/* Home Route (No Sidebar) */}
            <Route path="/" element={<Home />} />
            
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
              <Route path="/contribute/new" element={<GuideEditor mode="public" />} />
              <Route path="/contribute/playground" element={<GuideEditor mode="public" playground />} />

              {/* Dynamic Documentation Route (Fallback) */}
              <Route path="/docs/:category/:slug" element={<DocsLoader />} />
              
              {/* Redirect /docs to /quickstart */}
              <Route path="/docs" element={<Navigate to="/quickstart" replace />} />
            </Route>
          </Routes>
        </RootLayout>
      </ToastProvider>
    </Router>
  );
}

export default App;
