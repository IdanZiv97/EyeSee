import React, { useState, useMemo } from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

function Reports({ data }) {
  // Add 'Date' column
  const columns = [
    { header: 'Date', key: 'date' },
    { header: 'Time Slice', key: 'slice' },
    { header: 'Total', key: 'total' },
    { header: 'Male', key: 'male' },
    { header: 'Female', key: 'female' },
    { header: 'Avg Dwell Time', key: 'avgDwellTime' },
    { header: '0-9', key: '0-9' },
    { header: '10-19', key: '10-19' },
    { header: '20-29', key: '20-29' },
    { header: '30-39', key: '30-39' },
    { header: '40-49', key: '40-49' },
    { header: '50-59', key: '50-59' },
    { header: '60+', key: '60+' },
  ];

  // Combine all reports into a single list with date added to each entry
  const allHourlyReports = useMemo(() => {
    return data.flatMap(report => 
      report.hourlyReports.map(hourlyReport => ({
        ...hourlyReport,
        date: hourlyReport.date // Assuming each hourlyReport has a date property
      }))
    );
  }, [data]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="Hourly Reports Table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allHourlyReports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.key}`}>
                      {row[column.key]}
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
          rowsPerPageOptions={[3, 6, 9]} // Adjusted options for rows per page
        />
      </TableContainer>
    </div>
  );
}

export default Reports;
