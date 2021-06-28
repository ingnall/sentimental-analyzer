import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import FacebookLogin from 'react-facebook-login';
import FacebookIcon from '../icons/Facebook';

const Login = () => {
  const navigate = useNavigate();
  const [wrong, setWrong] = useState(false);

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

  const componentClicked = () => { };

  const responseFacebook = (fbRes) => {
    console.log(fbRes);
    // eslint-disable-next-line no-undef
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        console.log(response);

        axios.post('http://localhost:5000/api/users/facebook-login', {
          firstName: fbRes.name.split(' ')[0],
          lastName: fbRes.name.split(' ')[1],
          email: fbRes.email,
        }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        })
          .then((res) => {
            console.log(res.data);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('loginWithFB', true);
            localStorage.setItem('token', fbRes.accessToken);
            navigate('/app/dashboard', { replace: true });
          })
          .catch((err) => { console.log(err); });
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(e) => {
              axios.post('http://localhost:5000/api/users/login', {
                email: e.email,
                password: e.password
              }, {
                headers: {
                  'Access-Control-Allow-Origin': true,
                }
              })
                .then((res) => {
                  console.log(res.data);
                  localStorage.setItem('userId', res.data.userId);
                  localStorage.setItem('loginWithFB', false);
                  localStorage.setItem('token', res.data.accessToken);
                  navigate('/app/dashboard', { replace: true });
                })
                .catch((err) => {
                  if (err.response.status === 404) { setWrong(true); console.log(err.response.data.emailnotfound); }
                  if (err.response.status === 400) { if (err.response.data.passwordincorrect) { setWrong(true); console.log(err.response.data.passwordincorrect); } else { console.log(err.response.data); } }
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              // isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                    textAlign="center"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                    textAlign="center"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid item xs={3} />
                  <Grid
                    item
                    xs={6}
                    justify="center"
                  >
                    <FacebookLogin
                      appId="1146881102489398"
                      fields="name,email,picture"
                      icon={<FacebookIcon style={{ marginBottom: '-6px', width: '25px' }} />}
                      size="small"
                      onClick={componentClicked}
                      callback={responseFacebook}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    pb: 1,
                    pt: 3
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or signin with email address
                  </Typography>
                </Box>
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
                  onFocus={() => setWrong(false)}
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
                  onFocus={() => setWrong(false)}
                  value={values.password}
                  variant="outlined"
                />
                <Typography color="red" size="large" textAlign="center" display={wrong ? 'block' : 'none'}>Email or password is wrong</Typography>
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    disabled={wrong}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
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

export default Login;
