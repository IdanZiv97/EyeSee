// material-ui
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useEffect, useState } from 'react';
import { Grid, Box, CircularProgress, Alert } from '@mui/material';
import UserSession from "pages/utils/UserSession";
import config from 'config';

export default function DwellTimeAndTotalCustomers({ store }) {
  const formatNumber = (number) => {
    if (!number) return '0';
    const formatted = parseFloat(number.toFixed(3));
    return formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toString();
  };

  const [loading, setLoading] = useState({
    isDailyTotalLoading: true,
    isDailyDwellLoading: true,
    isWeeklyTotalLoading: true,
    isWeeklyDwellLoading: true,
  });

  const [error, setError] = useState({
    dailyTotalError: null,
    dailyDwellError: null,
    weeklyTotalError: null,
    weeklyDwellError: null,
  });

  const [dailyTotal, setDailyTotal] = useState(null);
  const [dailyDwell, setDailyDwell] = useState(null);
  const [weeklyTotal, setWeeklyTotal] = useState(null);
  const [weeklyDwell, setWeeklyDwell] = useState(null);

  const fetchData = async () => {
    setLoading({
      isDailyTotalLoading: true,
      isDailyDwellLoading: true,
      isWeeklyTotalLoading: true,
      isWeeklyDwellLoading: true,
    });

    setError({
      dailyTotalError: null,
      dailyDwellError: null,
      weeklyTotalError: null,
      weeklyDwellError: null,
    });

    try {
      const response = await fetch(config.SERVER_DOMAIN + '/api/dashboard/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: UserSession.getUserId(),
          storeName: store,
        }),
      });

      const rsp = await response.json();
      if (!rsp.success) {
        // Use server-provided error message if available, otherwise default
        const serverErrorMsg = rsp.msg || null;
        throw new Error(serverErrorMsg);
      }
      console.log(rsp);

      // Update state for each card
      setDailyTotal(rsp.data.dailyTotal);
      setLoading((prev) => ({ ...prev, isDailyTotalLoading: false }));

      setDailyDwell(rsp.data.dailyDwell);
      setLoading((prev) => ({ ...prev, isDailyDwellLoading: false }));

      setWeeklyTotal(rsp.data.weeklyTotal);
      setLoading((prev) => ({ ...prev, isWeeklyTotalLoading: false }));

      setWeeklyDwell(rsp.data.weeklyDwell);
      setLoading((prev) => ({ ...prev, isWeeklyDwellLoading: false }));
    } catch (err) {
      const errorMessage = err.message;

      setError((prev) => ({
        ...prev,
        dailyTotalError: errorMessage || 'Error fetching daily total customers data',
        dailyDwellError: errorMessage || 'Error fetching daily dwell time data',
        weeklyTotalError: errorMessage || 'Error fetching weekly total customers data',
        weeklyDwellError: errorMessage || 'Error fetching weekly dwell time data',
      }));

      setLoading({
        isDailyTotalLoading: false,
        isDailyDwellLoading: false,
        isWeeklyTotalLoading: false,
        isWeeklyDwellLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [store]);

  const renderCard = (title, data, isLoading, isError, timeInterval, color) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">{isError}</Alert>
      ) : (
        <AnalyticEcommerce
          title={title}
          count={formatNumber(data?.total || 0)}
          percentage={formatNumber((data?.percentage || 0) * 100)}
          isLoss={data?.isLoss}
          color={color}
          extra={formatNumber(data?.diff || 0)}
          timeInterval={timeInterval}
        />
      )}
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      {renderCard(
        'Total customers this week',
        weeklyTotal,
        loading.isWeeklyTotalLoading,
        error.weeklyTotalError,
        'week',
        weeklyTotal?.isLoss ? 'warning' : 'success'
      )}
      {renderCard(
        'Total customers yesterday',
        dailyTotal,
        loading.isDailyTotalLoading,
        error.dailyTotalError,
        'day',
        dailyTotal?.isLoss ? 'warning' : 'success'
      )}
      {renderCard(
        'Average dwell time this week',
        weeklyDwell,
        loading.isWeeklyDwellLoading,
        error.weeklyDwellError,
        'week',
        weeklyDwell?.isLoss ? 'warning' : 'success'
      )}
      {renderCard(
        'Average dwell time yesterday',
        dailyDwell,
        loading.isDailyDwellLoading,
        error.dailyDwellError,
        'day',
        dailyDwell?.isLoss ? 'warning' : 'success'
      )}
    </Grid>
  );
}
