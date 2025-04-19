import React, { useState } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { Company } from './types'; // Import the Company type

function App() {
  // State now holds the selected Company object
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleSearch = (query: string) => {
    // TODO: Implement search logic if needed. 
    console.log('Search triggered:', query);
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  // Function to handle updates to the company (e.g., CMC ID change)
  // This would typically involve updating a central state store or API
  // For now, just update the selected company in local state
  const handleUpdateCompany = (updatedCompany: Company) => {
    if (selectedCompany && selectedCompany.id === updatedCompany.id) {
      setSelectedCompany(updatedCompany);
    }
    // TODO: Update the master list of companies (e.g., in Sidebar state or a context)
  };

  return (
    <ThemeProvider>
      <Layout 
        onSearch={handleSearch} 
        onSelectCompany={handleSelectCompany}
        selectedCompanyId={selectedCompany?.id} // Pass the selected company ID
      >
        {/* Pass the selected company and the update handler to the Dashboard */}
        <Dashboard 
          selectedCompany={selectedCompany} 
          onUpdateCompany={handleUpdateCompany} 
        />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
