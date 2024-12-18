import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Material-UI Components
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

import UserSession from 'pages/utils/UserSession';
import config from 'config';

export default function AuthRegister() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleFormSubmit = async (values, { setSubmitting }) => {
        console.log('Submitting form with values:', values); // Debugging
        try {
            const serverDomain = config.SERVER_DOMAIN; // Updated to use Vite environment variables
            if (!serverDomain) {
                throw new Error('Server domain is not defined in environment variables');
            }

            const response = await axios.post(`${serverDomain}/signup`, {
                username: values.username,
                password: values.password,
                email: values.email,
                storename: values.company,
                firstname: values.firstname,
                lastname: values.lastname
            });

            console.log('Server response:', response.data); // Debugging

            if (response.status === 200 && response.data.success) {
                UserSession.storeUserInfo({
                    userId: response.data.userId,
                    username: response.data.username,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    mainStoreId: response.data.mainStore,
                    stores: [response.data.storeName]
                });
                navigate('/dashboard/default');
            } else {
                setErrorMessage(response.data.msg || 'An unknown error occurred.');
            }
        } catch (error) {
            console.error('Error occurred:', error.message); // Debugging
            setErrorMessage(error.response ? error.response.data.msg : error.message);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        console.log('Clearing user session'); // Debugging
        UserSession.clearUserSession();
    }, []);

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
                            {[
                                { name: 'firstname', label: 'First Name' },
                                { name: 'lastname', label: 'Last Name' },
                                { name: 'username', label: 'Username' },
                                { name: 'email', label: 'Email' },
                                { name: 'company', label: 'Company' },
                                { name: 'password', label: 'Password' }
                            ].map((field, index) => (
                                <Grid item xs={12} key={index}>
                                    <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                                    <OutlinedInput
                                        id={field.name}
                                        type={field.name === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                                        name={field.name}
                                        value={values[field.name]}
                                        onChange={handleChange}
                                        endAdornment={field.name === 'password' ? (
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
                                        error={Boolean(touched[field.name] && errors[field.name])}
                                    />
                                    <FormHelperText error>{touched[field.name] && errors[field.name]}</FormHelperText>
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