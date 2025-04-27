import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
  ListItemButton,
  Tooltip,
  Avatar,
  Badge,
} from '@mui/material';
import {
  BarChart,
  TrendingUp,
  Users,
  Star,
  Info,
  Settings,
  Building,
  PlusCircle,
} from 'lucide-react';
import { Company } from '../../types';

// --- Mock Company Data (Replace with dynamic data/state management later) ---
const mockCompanies: Company[] = [
  {
    id: 'phantom-1', // Added unique ID
    name: 'Phantom',
    identifiers: {
      twitter: 'phantom',
      linkedin: 'phantomwallet',
      medium: 'phantom-blog',
      defillama: 'phantom', // Added DefiLlama protocol identifier
      //cmcSymbolOrId: 'SOL', // Added example CMC symbol (Solana, as Phantom is a Solana wallet)
    },
  },
  // Add more companies here as needed
];
// --- End Mock Data ---

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onSelectCompany: (company: Company) => void;
  selectedCompanyId?: string | null; // Pass down selected ID for styling
}

const drawerWidth = 280;

const Sidebar: React.FC<SidebarProps> = ({ 
  mobileOpen,
  handleDrawerToggle,
  onSelectCompany,
  selectedCompanyId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [companies, setCompanies] = useState<Company[]>(mockCompanies); // Manage companies in state

  // TODO: Implement function to add/update companies (e.g., for CMC ID updates)
  // const updateCompany = (updatedCompany: Company) => {
  //   setCompanies(prevCompanies => 
  //     prevCompanies.map(c => c.id === updatedCompany.id ? updatedCompany : c)
  //   );
  // };

  const getLogoURL = (companyName: string) => {
    // Replace spaces with hyphens and convert to lowercase
    const formattedName = companyName.toLowerCase().replace(/\s+/g, '-');
    return `https://logo.clearbit.com/${formattedName}.com`;
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h6" color="textPrimary" fontWeight="bold">
          Competitor Analysis
        </Typography>
      </Box>
      {/* <List>
        Navigation items - removed for brevity, add back if needed
      </List> */}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          COMPANIES
        </Typography>
      </Box>

      <List>
        {companies.map((company) => {
          const logoURL = getLogoURL(company.name);
          return (
            <ListItem key={company.id} disablePadding>
              <ListItemButton
                selected={selectedCompanyId === company.id}
                onClick={() => onSelectCompany(company)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar
                    src={logoURL}
                    alt={company.name.charAt(0)}
                    sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.light, fontSize: '0.8rem' }}
                    imgProps={{ onError: (e: any) => { e.target.src = ''; } }} // Handle logo load errors
                  >
                    {company.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={company.name}
                  primaryTypographyProps={{
                    noWrap: true,
                    variant: 'body2',
                    fontWeight: selectedCompanyId === company.id ? 'bold' : 'medium',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItem disablePadding>
          <ListItemButton 
             // TODO: Implement add company functionality
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PlusCircle size={22} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText
              primary="Add New Company"
              primaryTypographyProps={{
                color: 'textSecondary',
                variant: 'body2',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Settings size={22} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
         {/* <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Info size={22} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText primary="Help & Info" />
          </ListItemButton>
        </ListItem> */}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;