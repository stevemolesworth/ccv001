import { AppLayout } from '@diligentcorp/atlas-react-bundle';
import { Outlet, Route, Routes } from 'react-router';
import './styles.css';

import Navigation from './Navigation.js';
import ComplianceReportsPage from './pages/ComplianceReportsPage.js';
import IndexPage from './pages/IndexPage.js';
import SettingsPage from './pages/SettingsPage.js';
import StylesPage from './pages/StylesPage.js';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout navigation={<Navigation />} orgName="Connected Compliance">
            <Outlet />
          </AppLayout>
        }
      >
        <Route index element={<IndexPage />} />
        <Route path="compliance-reports" element={<ComplianceReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="styles" element={<StylesPage />} />
      </Route>
    </Routes>
  );
}
