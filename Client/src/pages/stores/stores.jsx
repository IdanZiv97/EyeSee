import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import UserSession from 'pages/utils/UserSession';
import config from 'config';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [editingStoreIndex, setEditingStoreIndex] = useState(null);
  const [newStoreName, setNewStoreName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.SERVER_DOMAIN}/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: UserSession.getUserId(),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stores.');
        }

        const storeNames = Object.keys(data);
        const formattedStores = storeNames.map((name) => ({
          name,
          numOfReports: data[name].numOfReports || '0',
          createdAt: formatDate(data[name].createdAt) || 'N/A',
        }));

        setStores(formattedStores);
        UserSession.setStores(storeNames);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate); // Parse the ISO string into a Date object
    const day = date.getDate(); // Get the day (1-31)
    const month = date.getMonth() + 1; // Get the month (0-11), so add 1
    const year = date.getFullYear(); // Get the full year (e.g., 2024)
    return `${day}/${month}/${year}`; // Combine in the desired format
  };

  const handleAddStore = async () => {
    if (!newStoreName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${config.SERVER_DOMAIN}/store/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: UserSession.getUserId(),
          storeName: newStoreName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add store.');
      }
      const today = new Date(); 
      const updatedStores = [...stores, { name: newStoreName, numOfReports: '0', createdAt: formatDate(today) }];
      const updatedStoreNames = updatedStores.map((store) => store.name);

      setStores(updatedStores);
      UserSession.setStores(updatedStoreNames); // Save only store names
      setNewStoreName('');
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteStore = async (storeName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.SERVER_DOMAIN}/store/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: UserSession.getUserId(),
          storeName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete store.');
      }

      const updatedStores = stores.filter((store) => store.name !== storeName);
      const updatedStoreNames = updatedStores.map((store) => store.name);

      setStores(updatedStores);
      UserSession.setStores(updatedStoreNames); // Save only store names
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreNameChange = (index, newName) => {
    setStores((prev) =>
      prev.map((store, i) =>
        i === index ? { ...store, name: newName } : store
      )
    );
  };

  const handleSaveStoreName = async (index) => {
    const originalName = UserSession.getStores()[index]; // Original name from UserSession
    const newName = stores[index]?.name?.trim(); // Updated name from local state

    if (!originalName || newName === originalName) {
      // If no change, exit edit mode
      setEditingStoreIndex(null);
      return;
    }

    // Set loading state for the row being edited
    const updatedStores = stores.map((store, i) =>
      i === index ? { ...store, isLoading: true } : store
    );
    setStores(updatedStores);

    try {
      const response = await fetch(`${config.SERVER_DOMAIN}/store/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: UserSession.getUserId(),
          storeName: originalName,
          newName,
        }),
      });

      const rsp = await response.json();

      if (!response.ok || !rsp.success) {
        // Handle server error
        throw new Error(rsp.msg || 'Failed to update store name.');
      }

      // Update local state and UserSession with the new name
      const finalStores = stores.map((store, i) =>
        i === index ? { ...store, name: newName, isLoading: false } : store
      );
      setStores(finalStores);

      const updatedStoreNames = finalStores.map((store) => store.name);
      UserSession.setStores(updatedStoreNames); // Save updated names in UserSession

      setEditingStoreIndex(null); // Exit edit mode
      setErrorMessage(''); // Clear any previous error
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      // Remove the loading state for the row
      const resetStores = stores.map((store, i) =>
        i === index ? { ...store, isLoading: false } : store
      );
      setStores(resetStores);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Stores</Typography>
        <Button
          variant="contained"
          onClick={() => setShowActions((prev) => !prev)}
        >
          {showActions ? 'Hide Actions' : 'Edit'}
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Store Name</TableCell>
              <TableCell align="right">Number of Reports</TableCell>
              <TableCell align="right">Created At</TableCell>
              {showActions && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {stores.map((store, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editingStoreIndex === index ? (
                        <TextField
                          value={store.name}
                          onChange={(e) => handleStoreNameChange(index, e.target.value)}
                          fullWidth
                        />
                      ) : (
                        store.name
                      )}
                    </TableCell>
                    <TableCell align="right">{store.numOfReports}</TableCell>
                    <TableCell align="right">{store.createdAt}</TableCell>
                    {showActions && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          {editingStoreIndex === index ? (
                            <IconButton
                              edge="end"
                              aria-label="save"
                              onClick={() => handleSaveStoreName(index)}
                            >
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={() => setEditingStoreIndex(index)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteStore(store.name)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {isAdding && (
                  <TableRow>
                    <TableCell>
                      <TextField
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                        placeholder="Enter store name"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell colSpan={3} align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddStore}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
                {showActions && !isAdding && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <IconButton
                        aria-label="add-store"
                        onClick={() => setIsAdding(true)}
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
