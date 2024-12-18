import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project import
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AuthCard from './AuthCard';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        {/* Disable interaction for the logo */}
        <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
          <Box sx={{ pointerEvents: 'none' }}>
            <Logo />
          </Box>
        </Grid>

        {/* Keep links inside the card functional */}
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: {
                xs: 'calc(100vh - 210px)',
                sm: 'calc(100vh - 134px)',
                md: 'calc(100vh - 112px)',
              },
            }}
          >
            <Grid item>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Disable interaction for the footer */}
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <Box sx={{ pointerEvents: 'none' }}>
            <AuthFooter />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
