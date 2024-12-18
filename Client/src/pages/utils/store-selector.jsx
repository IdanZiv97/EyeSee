import React, { useState } from "react";
import { TextField, Menu, MenuItem, Button, Box, CircularProgress, Typography } from "@mui/material";
import config from "config";
import UserSession from "pages/utils/UserSession";

export default function StoreSelector({ selectedStore, setSelectedStore, enableAddStore = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [stores, setStores] = useState(UserSession.getStores()); // Fetch initial stores
  const open = Boolean(anchorEl);

  const handleStoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsAddingStore(false); // Reset add store state when menu closes
    setNewStoreName(""); // Clear the input field
    setErrorMessage(""); // Clear any error messages
  };

  const handleAddStoreClick = () => {
    setIsAddingStore(true); // Enable the add store functionality
    setErrorMessage(""); // Clear any previous error messages
  };

  const handleNewStoreSubmit = async () => {
    setIsLoading(true); // Show loading spinner
    setErrorMessage(""); // Clear previous errors
    try {
      const response = await fetch(`${config.SERVER_DOMAIN}/store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName: newStoreName,
          userId: UserSession.getUserId(), // Replace with the actual user ID
        }),
      });

      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred."); // Extract 'error' field from response
      }

      // Add the new store to the stores list
      const updatedStores = [...stores, newStoreName];
      UserSession.setStores(updatedStores);
      setStores(UserSession.getStores());

      // Select the newly added store
      setSelectedStore(newStoreName);

      // Reset the input field and exit add store mode
      setNewStoreName("");
      setIsAddingStore(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message); // Display the error message from the server
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  return (
    <>
      <TextField
        label="Store"
        value={selectedStore}
        onClick={handleStoreClick}
        InputProps={{
          readOnly: true,
        }}
        sx={{
          width: "220px", // Match width of DatePicker
          height: "42px", // Ensure consistent height
          marginTop: "6px", // Adjust the vertical position
          "& .MuiInputBase-root": {
            height: "56px", // Match DatePicker input height
          },
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        {stores.map((store, index) => (
          <MenuItem
            key={index}
            onClick={() => handleStoreSelect(store)}
          >
            {store}
          </MenuItem>
        ))}
        {enableAddStore && (
          <MenuItem>
            {isAddingStore ? (
              <Box display="flex" flexDirection="column" gap={1} sx={{ width: "100%" }}>
                {errorMessage && (
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                )}
                <TextField
                  label="Enter store name"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  size="small"
                  error={!!errorMessage}
                />
                <Button
                  onClick={handleNewStoreSubmit}
                  variant="contained"
                  disabled={!newStoreName.trim() || isLoading} // Disable button if input is empty or loading
                  startIcon={isLoading && <CircularProgress size={20} />}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            ) : (
              <Button
                onClick={handleAddStoreClick}
                variant="contained"
                fullWidth
              >
                Add a Store
              </Button>
            )}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

