import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Material-UI Components
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

import UserSession from 'pages/utils/UserSession';

export default function AuthRegister() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // New state for handling error messages

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleFormSubmit = async (values, { setSubmitting }) => {
      try {
          const response = await axios.post(`${config.SERVER_DOMAIN}/signup`, {
              username: values.username,
              password: values.password,
              email: values.email,
              storename: values.company,
              firstname: values.firstname,
              lastname: values.lastname
          });
          // Check for successful response; make sure this matches your actual API response structure
          if (response.status === 200 && response.data.success) {
            // Store user info in local storage
            UserSession.storeUserInfo({
                userId: response.data.userId,
                username: response.data.username,
                firstName: response.firstName,
                lastName: response.lastName,
                mainStoreId: response.data.mainStore,
                stores: [response.data.storeName]
            });
            navigate('/dashboard/default'); // Navigate to the dashboard
        } else {
            setErrorMessage(response.data.msg); // Handle setting the error message if not successful
        }        
      } catch (error) {
          setErrorMessage(error.response ? error.response.data.msg : 'Server error'); // Handle potential errors from the server or network
      } finally {
          setSubmitting(false);
      }
    };
    useEffect(()=>{
        //logoff the current user.
        UserSession.clearUserSession();
    },[])  

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    username: '',
                    email: '',
                    company: '',
                    password: '',
                }}
                validationSchema={Yup.object({
                    firstname: Yup.string().required('First Name is required'),
                    lastname: Yup.string().required('Last Name is required'),
                    username: Yup.string().required('Username is required'),
                    email: Yup.string().email('Invalid email').required('Email is required'),
                    company: Yup.string().required('Company name is required'),
                    password: Yup.string().required('Password is required'),
                })}
                onSubmit={handleFormSubmit}
            >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {['firstname', 'lastname', 'username', 'email', 'main store', 'password'].map((field, index) => (
                                <Grid item xs={12} key={index}>
                                    <InputLabel htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</InputLabel>
                                    <OutlinedInput
                                        id={field}
                                        type={field === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                                        name={field}
                                        value={values[field]}
                                        onChange={handleChange}
                                        endAdornment={field === 'password' ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null}
                                        fullWidth
                                        error={Boolean(touched[field] && errors[field])}
                                        helperText={touched[field] && errors[field]}
                                    />
                                    <FormHelperText error>{touched[field] && errors[field]}</FormHelperText>
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                                    Create Account
                                </Button>
                            </Grid>
                            {errorMessage && (
                                <Grid item xs={12}>
                                    <Typography color="error" variant="body2">
                                        {errorMessage}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                )}
            </Formik>
        </Box>
    );
}
