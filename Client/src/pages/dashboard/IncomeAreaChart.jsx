import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert'; // Import Alert

// third-party
import ReactApexChart from 'react-apexcharts';

import UserSession from "pages/utils/UserSession";
import config from 'config';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ slot, store }) {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: new Array(12).fill(secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        },
        title: { text: 'Customers' }
      },
      grid: {
        borderColor: line
      }
    }));
  }, [theme, secondary, line]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = UserSession.getUserId();
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `${config.SERVER_DOMAIN}/api/customers/${slot === 'month' ? 'monthly' : 'weekly'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, storeName: store }),
          }
        );

        const data = await response.json();

        if (!data.success) throw new Error(data.message || 'Error fetching data.');

        const categories = data.data.map((item) => item.date);
        const values = data.data.map((item) => item.totalCustomers || item.data);

        setOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories
          }
        }));

        setSeries([{ name: 'Customers', data: values }]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slot, store]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

IncomeAreaChart.propTypes = {
  slot: PropTypes.string.isRequired,
  store: PropTypes.string.isRequired
};
