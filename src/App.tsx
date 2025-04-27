import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import theme from './theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { CompanyMetrics } from './components/dashboard/CompanyMetrics';
import { Company } from './types';

// Wrapper component to use hooks in the router context
const AppContent: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const navigate = useNavigate();

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    // Navigate to the metrics page for the selected company
    navigate(`/metrics/${company.id}`);
  };

  const handleSearch = (query: string) => {
    // Implement search functionality if needed
    console.log('Search query:', query);
  };

  return (
    <Layout 
      onSearch={handleSearch}
      onSelectCompany={handleSelectCompany}
      selectedCompanyId={selectedCompany?.id || null}
    >
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              selectedCompany={selectedCompany}
              onUpdateCompany={setSelectedCompany}
            />
          } 
        />
        <Route 
          path="/metrics/:id" 
          element={
            selectedCompany ? (
              <CompanyMetrics 
                company={selectedCompany}
              />
            ) : null
          } 
        />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
