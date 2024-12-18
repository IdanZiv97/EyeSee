import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import UserSession from 'pages/utils/UserSession';
import config from 'config';

import {
    Button,
    Grid,
    InputAdornment,
    IconButton,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Typography
} from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const AuthLogin = ({ isDemo = false }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleFormSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post(`${config.SERVER_DOMAIN}/login`, {
                username: values.username,
                password: values.password
            });

            if (response.status === 200 && response.data.success) {
                // Store all user info in UserSession
                UserSession.storeUserInfo({
                    userId: response.data.userId,
                    username: response.data.username,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    mainStoreId: response.data.mainStore,
                    stores: response.data.stores
                });
                navigate('/dashboard/default'); // Navigate to the dashboard
            } else {
                setErrorMessage(response.data.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.msg || 'User does not exist');
            } else {
                setErrorMessage('Network error');
            }
        } finally {
            setSubmitting(false);
        }
    };
    useEffect(()=>{
      //log off the current user.
      UserSession.clearUserSession();
    },[])

    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={Yup.object({
                username: Yup.string().required('Username is required'),
                password: Yup.string().required('Password is required')
            })}
            onSubmit={handleFormSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Field name="username" as={OutlinedInput} fullWidth />
                            {touched.username && errors.username && (
                                <FormHelperText error>{errors.username}</FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Field
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                as={OutlinedInput}
                                fullWidth
                                endAdornment={
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
                                }
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error>{errors.password}</FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                Login
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
                </Form>
            )}
        </Formik>
    );
};

export default AuthLogin;
