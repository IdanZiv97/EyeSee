import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Stack, Button, CircularProgress, Alert } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import MainCard from 'components/MainCard';
import UserSession from "pages/utils/UserSession";
import config from 'config';

// Define base chart options
const initialBarChartOptions = {
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: { horizontal: false, columnWidth: '50%', endingShape: 'rounded' },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: [], // Will be updated dynamically
  },
  yaxis: { title: { text: 'Minutes' } },
  fill: {
    colors: ['#00C49F'],
    opacity: 1,
  },
  tooltip: { y: { formatter: (val) => `${val.toFixed(1)} minutes` } },
};

export default function DwellTimeChart({ store }) {
  const [timeRange, setTimeRange] = useState('week'); // Default time range
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(initialBarChartOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = UserSession.getUserId();
      const endpoint = timeRange === 'week' ? 'weekly' : 'monthly';
      const response = await fetch(config.SERVER_DOMAIN + `/api/dwell-time/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, storeName: store }),
      });

      const data = await response.json();
      if (!data.success) throw new Error('Error fetching data');

      // Prepare data for the chart
      const chartData = data.data.map((item) =>
        timeRange === 'week'
          ? parseFloat(item.data.toFixed(1))
          : parseFloat(item.avgDwellTime.toFixed(1))
      );
      const categories = data.data.map((item) => item.date);

      setSeries([{ data: chartData }]);
      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { ...prevOptions.xaxis, categories },
      }));
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, store]);

  return (
    <>
      {/* Header with toggle buttons */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h5">Average Dwell Time</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => setTimeRange('month')}
              color={timeRange === 'month' ? 'primary' : 'secondary'}
              variant={timeRange === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setTimeRange('week')}
              color={timeRange === 'week' ? 'primary' : 'secondary'}
              variant={timeRange === 'week' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Loading and Error Handling */}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Chart */}
      {!loading && !error && (
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box id="chart" sx={{ bgcolor: 'transparent' }}>
            <ReactApexChart options={options} series={series} type="bar" height={365} />
          </Box>
        </MainCard>
      )}
    </>
  );
}
