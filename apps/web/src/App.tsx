import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ArchitecturePage } from './pages/Architecture'
import { DashboardPage } from './pages/Dashboard'
import { WorkflowsPage } from './pages/Workflows'
import { ClientsPage } from './pages/Clients'
import { AutomationsPage } from './pages/Automations'
import { KnowledgePage } from './pages/Knowledge'
import { AuditPage } from './pages/Audit'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/architecture" replace />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/automations" element={<AutomationsPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/audit" element={<AuditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
