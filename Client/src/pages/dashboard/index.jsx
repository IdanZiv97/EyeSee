// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import DwellTimeChart from './DwellTimeChart';
import ReportAreaChart from './ReportAreaChart';
import UniqueVisitorCard from './UniqueVisitorCard';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';
import PieChart from './PieChart';


// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import DwellTimeAndTotalCustomers from './DwellTimeAndTotalCustomers';

// store btn
import UserSession from "pages/utils/UserSession";
import React, { useEffect, useState } from "react";
import StoreSelector from "pages/utils/store-selector"; // Import the new component

//recent reports
import RecentReports from './RecentReports';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [selectedStore, setSelectedStore] = useState(UserSession.getMainStore());
  useEffect(()=>{},[StoreSelector]);
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: 4.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Dashboard</Typography>
        <StoreSelector
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
        />
      </Grid>
      <DwellTimeAndTotalCustomers store={selectedStore}/>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={6} lg={6}>
        <UniqueVisitorCard store={selectedStore}/>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <DwellTimeChart store={selectedStore}/>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={6}>
        <PieChart store={selectedStore} />
      </Grid>
      <Grid item xs={12} md={7} lg={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Reports</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <RecentReports store={selectedStore} />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12} md={7} lg={8}>
      </Grid>
    </Grid>
  );
}
