import React, { useState } from 'react';
import { Typography, Grid, Button, Stack, TextField, Alert, LinearProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import MainCard from 'components/MainCard';
import dayjs from 'dayjs';
import UserSession from 'pages/utils/UserSession';
import StoreSelector from 'pages/utils/store-selector';
import config from 'config';
import { useNavigate } from 'react-router-dom';

export default function UploadVideo() {
    const [video, setVideo] = useState(null);
    const [date, setDate] = useState(dayjs());
    const [selectedStore, setSelectedStore] = useState(UserSession.getMainStore());
    const [startHour, setStartHour] = useState(dayjs());
    const [endHour, setEndHour] = useState(dayjs());
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0); // Progress bar percentage
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        setVideo(file);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setUploading(true);
        setProgress(0);

        if (!video) {
            setError('Please select a video to upload.');
            setUploading(false);
            return;
        }

        if (!date || !startHour || !endHour) {
            setError('Please select the date and time.');
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', video);
        formData.append('upload_preset', 'eyesee');
        const cloudinaryName = config.CLOUDINARY_CLOUD_NAME;

        try {
            // Simulate progress
            const interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return Math.min(oldProgress + 10, 100);
                });
            }, 200);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryName}/video/upload`,
                {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                }
            );

            if (!response.ok) {
                clearInterval(interval);
                const errorMessage = await response.text();
                throw new Error(errorMessage || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            const videoDetails = {
                userId: UserSession.getUserId(),
                storeName: selectedStore,
                date: date.format('YYYY-MM-DD'),
                url: data.secure_url,
                startTime: startHour.format('HH:mm'),
                endTime: endHour.format('HH:mm'),
                length: Math.round(dayjs(endHour).diff(dayjs(startHour), 'minute')),
            };

            const serverResponse = await fetch('http://localhost:4000/video/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(videoDetails),
            });

            if (!serverResponse.ok) {
                clearInterval(interval);
                const errorData = await serverResponse.json();
                throw new Error(errorData.msg || 'Failed to upload video details.');
            }

            setProgress(100);
            setMessage('Redirecting to jobs page...');
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/jobs');
            }, 2000);
        } catch (err) {
            setUploading(false);
            setError(err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5">Upload</Typography>
                <Stack direction="row" spacing={3} alignItems="center">
                    <StoreSelector selectedStore={selectedStore} setSelectedStore={setSelectedStore} />
                </Stack>
            </Grid>
            <MainCard>
                {!isSuccess ? (
                    uploading ? (
                        <Stack spacing={2} alignItems="center">
                            <Typography>Uploading...</Typography>
                            <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} />
                        </Stack>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <Button variant="contained" component="label">
                                    Upload Video
                                    <input type="file" hidden accept="video/*" onChange={handleVideoChange} />
                                </Button>
                                {video && <Typography>Selected File: {video.name}</Typography>}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Select Date"
                                        value={date}
                                        onChange={(newValue) => setDate(newValue)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    <TimePicker
                                        label="Start Hour"
                                        value={startHour}
                                        onChange={(newValue) => setStartHour(newValue)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    <TimePicker
                                        label="End Hour"
                                        value={endHour}
                                        onChange={(newValue) => setEndHour(newValue)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                                {error && <Alert severity="error">{error}</Alert>}
                            </Stack>
                        </form>
                    )
                ) : (
                    <Alert severity="success">{message}</Alert>
                )}
            </MainCard>
        </div>
    );
}