import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import UserSession from "pages/utils/UserSession";
import config from "config";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${config.SERVER_DOMAIN}/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: UserSession.getUserId(),
          }),
        });

        const data = await response.json();

        if (data.success) {
          setJobs(data.jobs);
        } else {
          setError(data.msg || "An error occurred.");
        }
      } catch (error) {
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h5">Jobs</Typography>
      </Grid>
      <Grid item>
        {loading ? (
          <Grid container justifyContent="center" alignItems="center" style={{ height: "50vh" }}>
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : jobs.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Store Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Length</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Video URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.jobId}</TableCell>
                    <TableCell>{job.storeName}</TableCell>
                    <TableCell>{new Date(job.date).toLocaleDateString()}</TableCell>
                    <TableCell>{job.startTime}</TableCell>
                    <TableCell>{job.endTime}</TableCell>
                    <TableCell>{job.length} mins</TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        View Video
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No jobs available.</Typography>
        )}
      </Grid>
    </Grid>
  );
}
