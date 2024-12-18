import React, { useEffect, useState } from "react";
import fetchData from "./api";
import {fetchDataInit} from "./api";
import Reports from "../reports/reports";
import LoadingReports from "../reports/loading-reports";
import ReportsError from "../reports/reports-error";
import MainCard from "components/MainCard";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Grid, Typography, Stack } from "@mui/material";
import StoreSelector from "pages/utils/store-selector"; // Import the new component
import UserSession from "pages/utils/UserSession";
import HeatMapTable from "./heat-map-table";

export default function Insights() {
  const [component, setComponent] = useState(<LoadingReports />);
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs().subtract(1, "day"));
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs().subtract(1, "day"));
  const [selectedStore, setSelectedStore] = useState(UserSession.getMainStore());
  const [initialization, setInitialization] = useState(true);

  useEffect(() => {
    if (initialization === true) {
      fetchDataInit(UserSession.getUserId(), selectedStore)
        .then((rsp) => {
          if (rsp.success === false) {
            setComponent(<ReportsError props={rsp.msg || "Failed to fetch reports"} />);
            return;
          }
          // Extract date from the first entry in hourlyReports
          const firstDate = rsp.heatmap[0].date || dayjs().format("YYYY-MM-DD");
          setSelectedStartDate(dayjs(firstDate));
          setSelectedEndDate(dayjs(firstDate));
          setComponent(<HeatMapTable data={rsp} store={selectedStore} startDate={selectedStartDate} endDate={selectedEndDate}/>);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setComponent(<ReportsError props={`${error.msg}`} />);
        });
      setInitialization(false);
      return;
    }
      
    if (dayjs(selectedEndDate).isBefore(dayjs(selectedStartDate))) {
      setComponent(<ReportsError props="Invalid date range" />);
      return;
    }
  
    fetchData(
      UserSession.getUserId(),
      selectedStartDate.format("YYYY-MM-DD"),
      selectedEndDate.format("YYYY-MM-DD"),
      selectedStore
    )
      .then((rsp) => {
        if (rsp.success === false) {
          setComponent(<ReportsError props={rsp.msg || "Failed to fetch reports"} />);
          return;
        }
        setComponent(<HeatMapTable data={rsp} store={selectedStore} startDate={selectedStartDate} endDate={selectedEndDate}/>);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setComponent(<ReportsError props={`${error.message}`} />);
      });
  }, [selectedStartDate, selectedEndDate, selectedStore]);
  

  return (
    <>
      {/* Header with Date buttons and Store Selector */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h5">Heat Map</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Use the new StoreSelector component */}
            <StoreSelector
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  label="Start"
                  value={selectedStartDate}
                  onChange={(newValue) => setSelectedStartDate(newValue)}
                  sx={{
                    width: "220px", // Match width of Store button
                  }}
                />
                <DatePicker
                  label="End"
                  value={selectedEndDate}
                  onChange={(newValue) => setSelectedEndDate(newValue)}
                  sx={{
                    width: "220px", // Match width of Store button
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
        </Grid>
      </Grid>
      {/* Reports */}
      {component}
    </>
  );
}