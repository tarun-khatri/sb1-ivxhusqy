import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  InputBase,
  alpha,
  Button,
} from '@mui/material';
import { Menu, X, Search, Twitter, Moon, Sun } from 'lucide-react';
import { useThemeContext } from '../../theme/ThemeProvider';

interface HeaderProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ mobileOpen, handleDrawerToggle, onSearch }) => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeContext();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Twitter size={28} color={theme.palette.primary.main} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              ml: 1.5, 
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Competitor Analysis
          </Typography>
        </Box>
        
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
            marginRight: theme.spacing(2),
            marginLeft: theme.spacing(3),
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '100%', sm: '400px' },
            flexGrow: 1,
          }}
        >
          <Box sx={{ padding: theme.spacing(0, 2), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={20} color={theme.palette.text.secondary} />
          </Box>
          <InputBase
            placeholder="Search Twitter username..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              color: 'inherit',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
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
        
        <Box sx={{ flexGrow: 0 }}>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;