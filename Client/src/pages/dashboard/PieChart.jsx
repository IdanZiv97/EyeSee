import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, Stack, Typography, Box, Alert, Button } from '@mui/material';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import MainCard from 'components/MainCard';
import UserSession from 'pages/utils/UserSession';
import config from 'config';

// Extended color palette for multiple categories
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#841B2D', '#B10DA1', '#50EF39', '#39B7CD', '#FF5733', '#CDDC39'];

// Helper function to map data to colors consistently based on category names
const getColor = (category, colorMap) => {
  if (!colorMap[category]) {
    const availableColors = COLORS.filter(color => !Object.values(colorMap).includes(color));
    colorMap[category] = availableColors[0] || '#000000'; // Fallback to black if more categories than colors
  }
  return colorMap[category];
};

const fetchDistributionData = async (store, type, setFunction, setError, setLoading, setColorMap) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`${config.SERVER_DOMAIN}/api/${type}-distribution/monthly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: UserSession.getUserId(),
        storeName: store
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error fetching data');
    
    let chartData = [];
    if (type === 'gender') {
      chartData = Object.entries(data.data[0].distribution).map(([name, value]) => ({ name, value }));
    } else {
      chartData = data.data[0].distribution.map(({ ageGroup, totalCustomers }) => ({ name: ageGroup, value: totalCustomers }));
    }

    // Map colors to categories
    chartData.forEach(item => {
      item.color = getColor(item.name, setColorMap);
    });

    setFunction(chartData);
  } catch (error) {
    setError(error.toString());
  } finally {
    setLoading(false);
  }
};

const PieChart = ({ store }) => {
  const [filter, setFilter] = useState('age');
  const [data, setData] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDistributionData(store, filter, setData, setError, setLoading, setColorMap);
  }, [filter, store]);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h5">Customer Segmentation</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button
              size="small"
              onClick={() => setFilter('age')}
              color={filter === 'age' ? 'primary' : 'secondary'}
              variant={filter === 'age' ? 'outlined' : 'text'}
            >
              Age
            </Button>
            <Button
              size="small"
              onClick={() => setFilter('gender')}
              color={filter === 'gender' ? 'primary' : 'secondary'}
              variant={filter === 'gender' ? 'outlined' : 'text'}
            >
              Gender
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <RechartsPieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        )}
      </MainCard>
    </>
  );
};

export default PieChart;
