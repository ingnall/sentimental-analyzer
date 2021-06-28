/* eslint-disable no-alert */
import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField
} from '@material-ui/core';

const SettingsPassword = (props) => {
  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const updatePassword = () => {
    if (values.password === values.confirm === '') {
      alert('Please fields are required!');
    } else if (values.password !== values.confirm) {
      alert('Password and Confirm password are not same!');
    } else if (values.password.length < 8) {
      alert('Password must be at least 8 characters.');
    } else {
      axios.post('http://localhost:5000/api/user/setting', {
        userId: localStorage.getItem('userId'),
        password: values.password,
        password2: values.confirm,
        loginWithFB: localStorage.getItem('loginWithFB')
      }, {
        headers: {
          'Access-Control-Allow-Origin': true,
          'x-access-token': localStorage.getItem('token')
        }
      })
        .then((res) => console.log('success: ', res.data))
        .catch((err) => console.log(err));
    }
  };

  return (
    <form {...props}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm password"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
          />
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
            onClick={updatePassword}
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default SettingsPassword;
