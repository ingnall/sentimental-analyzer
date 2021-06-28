import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';

// eslint-disable-next-line no-unused-vars
const states = [
  {
    value: 'Punjab',
    label: 'Punjab'
  },
  {
    value: 'Sindh',
    label: 'Sindh'
  },
  {
    value: 'Balochistan',
    label: 'Balochistan'
  },
  {
    value: 'KPK',
    label: 'KPK'
  }
];

const AccountProfileDetails = (props) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstName: ' ',
    lastName: ' ',
    email: ' ',
    loginWithFB: false
  });

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
      setValues({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        loginWithFB: localStorage.getItem('loginWithFB'),
      });
    }).catch((err) => {
      if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
        console.log(err.response.message);
        navigate('/login', { replace: true });
      }
    });
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const updateUserDetail = () => {
    axios.post('http://localhost:5000/api/user/update', {
      userId: localStorage.getItem('userId'),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      loginWithFB: localStorage.getItem('loginWithFB'),
    }, {
      headers: {
        'Access-Control-Allow-Origin': true,
        'x-access-token': localStorage.getItem('token')
      }
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            {/* <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                value={values.country}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select State"
                name="state"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.state}
                variant="outlined"
              >
                {states.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
           */}
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={updateUserDetail}
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AccountProfileDetails;
