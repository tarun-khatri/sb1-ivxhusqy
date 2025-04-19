import React, { useState } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  const [searchUsername, setSearchUsername] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    // Remove @ symbol if present
    const normalizedQuery = query.startsWith('@') ? query.substring(1) : query;
    setSearchUsername(normalizedQuery);
  };

  const handleSelectAccount = (username: string) => {
    setSearchUsername(username);
  };

  return (
    <ThemeProvider>
      <Layout onSearch={handleSearch} onSelectAccount={handleSelectAccount}>
        <Dashboard username={searchUsername} />
      </Layout>
    </ThemeProvider>
  );
}

export default App;