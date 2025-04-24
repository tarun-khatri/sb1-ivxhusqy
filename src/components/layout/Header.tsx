import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { Menu, Search } from 'lucide-react';

interface HeaderProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ mobileOpen, handleDrawerToggle, onSearch }) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchValue);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
      elevation={1}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left section with menu and title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Black Mirror v0
          </Typography>
        </Box>

        {/* Center section with search */}
        <Box 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.black, 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.black, 0.1),
            },
            width: { xs: '100%', sm: '400px' },
            mx: 'auto',
          }}
        >
          <Box sx={{ 
            padding: theme.spacing(0, 2), 
            height: '100%', 
            position: 'absolute', 
            pointerEvents: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Search size={20} color={theme.palette.text.secondary} />
          </Box>
          <InputBase
            placeholder="Search companies..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                width: '100%',
              },
            }}
          />
          <Button 
            variant="contained" 
            color="primary"
            type="submit"
            sx={{ 
              position: 'absolute',
              right: 4,
              top: 4,
              bottom: 4,
              borderRadius: 50,
              px: 2,
              py: 0.5,
              minWidth: 'auto',
            }}
          >
            Search
          </Button>
        </Box>

        {/* Right section - can be used for dark mode toggle */}
        <Box sx={{ width: { xs: 'auto', sm: '100px' }, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Dark mode toggle will be added here */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;