import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import config from "config";

export default function HeatMapTable({ data: initialData, store, startDate, endDate, setLoading }) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    setLoading(true); // Show loading logo
    setError("");

    const payload = { ids: [id] };

    try {
      const response = await fetch(`${config.SERVER_DOMAIN}/heatmap/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setData((prevData) => ({
          ...prevData,
          heatmaps: prevData.heatmaps.filter((heatmap) => heatmap._id !== id),
        }));
      } else {
        setError(`Failed to delete heatmap: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting heatmap:", error);
      setError("An error occurred while deleting the heatmap.");
    } finally {
      setLoading(false); // Hide loading logo
    }
  };

  const handleDownload = async (url, slug) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }
      const blob = await response.blob();
      const fileName = `heatmap_${store}_${slug}.png`; // Dynamically generate file name
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Use generated file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("An error occurred while downloading the image.");
    }
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sortedHeatmaps = data?.heatmaps
    ? [...data.heatmaps].sort((a, b) => new Date(b.slug) - new Date(a.slug))
    : [];

  return (
    <div>
      {error && (
        <Alert severity="error" style={{ marginBottom: "1rem" }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedHeatmaps.length > 0 ? (
              sortedHeatmaps.map((heatmap) => (
                <TableRow key={heatmap._id}>
                  <TableCell>{heatmap.slug}</TableCell>
                  <TableCell>
                    <a href={heatmap.url} target="_blank" rel="noopener noreferrer">
                      {heatmap.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="default" // Gray button
                      onClick={() => handleDownload(heatmap.url, heatmap.slug)}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      color="default" // Gray button
                      onClick={() => handleDelete(heatmap._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No heatmaps available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
