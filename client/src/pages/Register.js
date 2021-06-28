import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  // Checkbox,
  Container,
  // FormHelperText,
  Link,
  TextField,
  Typography
} from '@material-ui/core';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/find', {
      headers: {
        'Access-Control-Allow-Origin': true,
        'x-access-token': localStorage.getItem('token')
      },
      params: {
        userId: localStorage.getItem('userId'),
        loginWithFB: localStorage.getItem('loginWithFB')
      }
    }).then((res) => {
      console.log(res.data);
      navigate('/app/dashboard', { replace: true });
    }).catch((err) => { console.log(err); console.log('User not logged in'); });
  }, []);

  return (
    <>
      <Helmet>
        <title>Register | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              password2: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
              firstName: Yup.string()
                .max(255)
                .required('First name is required'),
              lastName: Yup.string()
                .max(255)
                .required('Last name is required'),
              password: Yup.string()
                .max(255)
                .required('password is required'),
              password2: Yup.string()
                .max(255)
                .required('password is required')
              // policy: Yup.boolean().oneOf(
              //   [true],
              //   'This field must be checked'
              // )
            })}
            onSubmit={(e) => {
              console.log(e);
              axios
                .post('http://localhost:5000/api/users/register', {
                  firstName: e.firstName,
                  lastName: e.lastName,
                  email: e.email,
                  password: e.password,
                  password2: e.password2
                }, {
                  headers: {
                    'Access-Control-Allow-Origin': true,
                  }
                })
                .then((res) => {
                  console.log(res.data);
                  // eslint-disable-next-line no-alert
                  alert('Account created.');
                  navigate('/login', { replace: true });
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2" marginTop="20px" textAlign="center">
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                    textAlign="center"
                  >
                    Use your email to create new account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="First name"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label="Last name"
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password2 && errors.password2)}
                  fullWidth
                  helperText={touched.password2 && errors.password2}
                  label="Confirm Password"
                  margin="normal"
                  name="password2"
                  type="password"
                  onBlur={handleChange}
                  onChange={handleChange}
                  value={values.password2}
                  variant="outlined"
                />
                {/* <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: -1
                  }}
                >
                  <Checkbox
                    checked={values.policy}
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography color="textSecondary" variant="body1">
                    I have read the
                    {' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>{errors.policy}</FormHelperText>
                )} */}
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1" marginBottom="20px">
                  Have an account?
                  {' '}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Register;
