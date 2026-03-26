import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PropertiesListPage from './pages/properties/PropertiesListPage'
import PropertyDetailPage from './pages/properties/PropertyDetailPage'
import PropertyFormPage from './pages/properties/PropertyFormPage'
import ClientsListPage from './pages/clients/ClientsListPage'
import ClientDetailPage from './pages/clients/ClientDetailPage'
import ClientFormPage from './pages/clients/ClientFormPage'
import LeadsListPage from './pages/leads/LeadsListPage'
import LeadsKanbanPage from './pages/leads/LeadsKanbanPage'
import LeadDetailPage from './pages/leads/LeadDetailPage'
import LeadFormPage from './pages/leads/LeadFormPage'
import ContractsPage from './pages/ContractsPage'
import InvoicesPage from './pages/InvoicesPage'
import ReportsPage from './pages/ReportsPage'
import AgentsPage from './pages/AgentsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected — wrapped in Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="properties" element={<PropertiesListPage />} />
                <Route path="properties/new" element={<PropertyFormPage />} />
                <Route path="properties/:id" element={<PropertyDetailPage />} />
                <Route path="properties/:id/edit" element={<PropertyFormPage />} />
                <Route path="clients" element={<ClientsListPage />} />
                <Route path="clients/new" element={<ClientFormPage />} />
                <Route path="clients/:id" element={<ClientDetailPage />} />
                <Route path="clients/:id/edit" element={<ClientFormPage />} />
                <Route path="leads" element={<LeadsListPage />} />
                <Route path="leads/kanban" element={<LeadsKanbanPage />} />
                <Route path="leads/new" element={<LeadFormPage />} />
                <Route path="leads/:id" element={<LeadDetailPage />} />
                <Route path="leads/:id/edit" element={<LeadFormPage />} />
                <Route path="contracts" element={<ContractsPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="agents" element={<AgentsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </ErrorBoundary>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                background: '#1f2937',
                color: '#f9fafb',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
