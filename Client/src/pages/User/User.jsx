import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import UserSession from 'pages/utils/UserSession';
import config from 'config';

export default function User() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userId: UserSession.getUserId(),
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    mainStore: UserSession.getMainStore(),
  });
  const [originalUserInfo, setOriginalUserInfo] = useState({});
  const [serverMessage, setServerMessage] = useState(''); // Server message (success or error)

  useEffect(() => {
    // Fetch user information from UserSession
    const userInfoFromSession = {
      userId: UserSession.getUserId(),
      username: UserSession.getUsername(),
      firstName: UserSession.getFirstName(),
      lastName: UserSession.getLastName(),
      email: UserSession.getEmail(),
      mainStore: UserSession.getMainStore(),
    };

    setUserInfo(userInfoFromSession);
    setOriginalUserInfo(userInfoFromSession); // Save original data for discarding changes
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (!userInfo.userId) {
      console.error('User ID is missing. Cannot send request to the server.');
      setServerMessage('User ID is missing. Please log in again.');
      return;
    }

    const body = {
      userId: userInfo.userId, // Include userId
      ...userInfo, // Include all updated fields
    };

    console.log('Sending changes to server:', body);

    try {
      const response = await fetch(`${config.SERVER_DOMAIN}/user-info`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      setServerMessage(data.message || 'No message provided by the server.');

      if (response.ok) {
        console.log('Response from server:', data);
        UserSession.updateUserInfo(userInfo); // Update UserSession with new info
        setOriginalUserInfo(userInfo); // Update original info
        setUserInfo({ ...userInfo, userId: UserSession.getUserId() }); // Ensure userId persists
        setIsEditing(false);
      } else {
        console.error('Error response from server:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
      setServerMessage('Network error. Please try again.');
    }
  };

  const handleDiscardChanges = () => {
    setUserInfo(originalUserInfo); // Revert to the original data
    setIsEditing(false);
    setServerMessage(''); // Clear server message
  };

  const handleInputChange = (field) => (event) => {
    setUserInfo({ ...userInfo, [field]: event.target.value });
    setServerMessage(''); // Clear server message on input change
  };

  return (
    <Box>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h5">User Information</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={3} alignItems="center">
            {isEditing ? (
              <>
                <Button variant="contained" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleDiscardChanges}>
                  Discard Changes
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleEditToggle}>
                Edit
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={userInfo.username}
              onChange={handleInputChange('username')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={userInfo.firstName}
              onChange={handleInputChange('firstName')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={userInfo.lastName}
              onChange={handleInputChange('lastName')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={userInfo.email}
              onChange={handleInputChange('email')}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Main Store</InputLabel>
              <Select
                value={userInfo.mainStore}
                onChange={(e) => setUserInfo({ ...userInfo, mainStore: e.target.value })}
                disabled={!isEditing}
              >
                {UserSession.getStores().map((store, index) => (
                  <MenuItem key={index} value={store}>
                    {store}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Display server message below the card */}
        {serverMessage && (
          <Box sx={{ mt: 2 }}>
            <Alert
              severity={serverMessage.toLowerCase().includes('success') ? 'success' : 'error'}
            >
              {serverMessage}
            </Alert>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
