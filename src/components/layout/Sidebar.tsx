import React from 'react';
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
  DollarSign,
  PlusCircle,
} from 'lucide-react';
import { mockTrackedAccounts } from '../../mock/data';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onSelectAccount: (username: string) => void;
}

const drawerWidth = 280;

const Sidebar: React.FC<SidebarProps> = ({ 
  mobileOpen, 
  handleDrawerToggle,
  onSelectAccount,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h6" color="textPrimary" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}>
            <ListItemIcon>
              <BarChart size={22} color={theme.palette.primary.main} />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}>
            <ListItemIcon>
              <TrendingUp size={22} color={theme.palette.secondary.main} />
            </ListItemIcon>
            <ListItemText primary="Trends" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}>
            <ListItemIcon>
              <Users size={22} color={theme.palette.success.main} />
            </ListItemIcon>
            <ListItemText primary="Comparison" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}>
            <ListItemIcon>
              <DollarSign size={22} color={theme.palette.warning.main} />
            </ListItemIcon>
            <ListItemText primary="Crypto Tracker" />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          TRACKED ACCOUNTS
        </Typography>
      </Box>
      
      <List>
        {mockTrackedAccounts.map((account) => (
          <ListItem key={account.username} disablePadding>
            <ListItemButton 
              onClick={() => onSelectAccount(account.username)}
              sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}
            >
              <ListItemIcon>
                <Avatar 
                  src={`https://unavatar.io/twitter/${account.username}`}
                  alt={account.username}
                  sx={{ width: 28, height: 28 }}
                />
              </ListItemIcon>
              <ListItemText 
                primary={`@${account.username}`}
                primaryTypographyProps={{
                  noWrap: true,
                  variant: 'body2',
                }}
              />
              <Tooltip title="Favorited account">
                <Badge>
                  <Star size={16} color={theme.palette.warning.main} />
                </Badge>
              </Tooltip>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}>
            <ListItemIcon>
              <PlusCircle size={22} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText 
              primary="Add New Account" 
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
          <ListItemButton sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}>
            <ListItemIcon>
              <Settings size={22} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: '0 24px 24px 0', mx: 1 }}>
            <ListItemIcon>
              <Info size={22} color={theme.palette.text.secondary} />
            </ListItemIcon>
            <ListItemText primary="Help & Info" />
          </ListItemButton>
        </ListItem>
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
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
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
            borderRight: `1px solid ${theme.palette.divider}`,
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