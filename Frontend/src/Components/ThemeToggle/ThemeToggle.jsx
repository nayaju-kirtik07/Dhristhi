import { useTheme } from '../../Context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { IconButton } from '@mui/material';
import './ThemeToggle.css';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`${isDarkMode ? 'dark-mode-theme-icon' : 'light-mode-theme-icon'}`}
      sx={{ 
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {isDarkMode ? <LightModeIcon className="theme-toggle-icon" /> : <DarkModeIcon />}
    </IconButton>
  );
}

export default ThemeToggle;
