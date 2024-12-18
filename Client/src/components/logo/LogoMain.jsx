// material-ui
import { useTheme } from '@mui/material/styles';

// Import the SVG file
import LogoSVG from './favicon.svg'; // Adjust the path as necessary

// ==============================|| LOGO SVG COMPONENT ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    <img src={LogoSVG} alt="Logo" width="60" />
  );
};

export default Logo;
