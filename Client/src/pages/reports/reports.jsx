import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import config from 'config';

function Reports({
  data,
  defaultReportsPerPage = 5,
  showButtons = true,
  store = null,
  startDate = null,
  endDate = null,
}) {
  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  // Update filteredData when store, startDate, or endDate changes
  useEffect(() => {
    setFilteredData(
      data.filter(report => {
        const matchesStore = store ? report.store === store : true;
        const matchesStartDate = startDate ? new Date(report.date) >= new Date(startDate) : true;
        const matchesEndDate = endDate ? new Date(report.date) <= new Date(endDate) : true;
        return matchesStore && matchesStartDate && matchesEndDate;
      })
    );
    setDeleteSuccess(false);
  }, [data, store, startDate, endDate]);

  const deleteReports = async () => {
    setLoading(true);
    setDeleteSuccess(false);
    try {
      const response = await fetch(`${config.SERVER_DOMAIN}/report/delReports`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportsIds: filteredData.map(item => item.reportId),
          store,
          startDate,
          endDate,
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error('Error deleting reports');
      setDeleteSuccess(true);
      setFilteredData([]); // Clear table after successful deletion
    } catch (err) {
      console.error(err);
      setDeleteSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!filteredData || filteredData.length === 0) {
      console.error('No data available to download');
      return;
    }

    // Define CSV headers
    const headers = columns.map(column => column.header).join(',');

    // Map data to CSV rows
    const rows = allHourlyReports.map(row =>
      columns.map(column => row[column.key] ?? '').join(',')
    );

    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Determine filename with date range and store
    const fileName = 'reports.csv';

    // Create a temporary link
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Dynamic filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const columns = [
    { header: 'Date', key: 'date' },
    { header: 'Time Slice', key: 'slice' },
    { header: 'Total', key: 'total' },
    { header: 'Male', key: 'male' },
    { header: 'Female', key: 'female' },
    { header: 'Avg Dwell Time', key: 'avgDwellTime' },
    { header: 'Young', key: 'young' },
    { header: 'Children', key: 'children' },
    { header: 'Adult', key: 'adult' },
    { header: 'Elder', key: 'elder' },
  ];

  const allHourlyReports = useMemo(() => {
    return filteredData.flatMap(report =>
      report.hourlyReports.map(hourlyReport => ({
        ...hourlyReport,
        date: hourlyReport.date,
      }))
    );
  }, [filteredData]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultReportsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : deleteSuccess ? (
        <Alert severity="success" style={{ marginTop: '20px', fontSize: '16px' }}>
          Reports deleted successfully
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="Hourly Reports Table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.key}>{column.header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allHourlyReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {columns.map(column => (
                      <TableCell key={`${index}-${column.key}`}>
                        {row[column.key] != null ? row[column.key] : 0}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={allHourlyReports.length}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[defaultReportsPerPage, 10, 15]}
          />
        </TableContainer>
      )}
      {showButtons && !loading && !deleteSuccess && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <Button variant="contained" color="primary" onClick={downloadCSV}>
            Download CSV
          </Button>
          <Button variant="contained" color="secondary" onClick={deleteReports}>
            Delete Reports
          </Button>
        </div>
      )}
    </div>
  );
}

export default Reports;