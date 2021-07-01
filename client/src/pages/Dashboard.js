import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import Negative from '../components/dashboard/Negative';
import Positive from '../components/dashboard/Positive';
import Neutral from '../components/dashboard/Neutral';
import History from '../components/dashboard/History';
import TrafficByDevice from '../components/dashboard/TrafficByDevice';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [positive, setPositive] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [negative, setNegative] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [compound, setCompound] = useState(0);

  useEffect(() => {
    setLoading(true);

    axios.get('http://localhost:5000/api/posts/findlatest', {
      headers: {
        'Access-Control-Allow-Origin': true,
        'x-access-token': localStorage.getItem('token')
      },
      params: {
        userId: localStorage.getItem('userId'),
        loginWithFB: localStorage.getItem('loginWithFB')
      }
    })
      .then((res) => {
        const totalComments = res.data.comments.length;
        let sumPositive = 0;
        let sumNeutral = 0;
        let sumNegative = 0;
        let sumCompound = 0;
        for (let i = 0; i < res.data.comments.length; i++) {
          sumPositive += res.data.comments[i].object.pos;
          sumNeutral += res.data.comments[i].object.neu;
          sumNegative += res.data.comments[i].object.neg;
          sumCompound += res.data.comments[i].object.compound;
        }
        setPositive(sumPositive / totalComments);
        setNeutral(sumNeutral / totalComments);
        setNegative(sumNegative / totalComments);
        setCompound(sumCompound / totalComments);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401 || err.response.status === 403) {
          console.log(err.response.message);
          setLoading(false);
          navigate('/login', { replace: true });
        } if (err.response.status === 404) {
          console.log(err.response.message);
          setLoading(false);
        } else {
          console.log(err);
          setLoading(false);
        }
      });
  }, []);

  const getSentiments = (url) => {
    axios.get('http://localhost:5000/api/posts/find', {
      headers: {
        'Access-Control-Allow-Origin': true,
        'x-access-token': localStorage.getItem('token')
      },
      params: {
        id: url,
        userId: localStorage.getItem('userId'),
        loginWithFB: localStorage.getItem('loginWithFB')
      }
    })
      .then((res) => {
        console.log(res.data);
        const totalComments = res.data.comments.length;
        let sumPositive = 0;
        let sumNeutral = 0;
        let sumNegative = 0;
        let sumCompound = 0;
        for (let i = 0; i < res.data.comments.length; i++) {
          sumPositive += res.data.comments[i].object.pos;
          sumNeutral += res.data.comments[i].object.neu;
          sumNegative += res.data.comments[i].object.neg;
          sumCompound += res.data.comments[i].object.compound;
        }
        setPositive(sumPositive / totalComments);
        setNeutral(sumNeutral / totalComments);
        setNegative(sumNegative / totalComments);
        setCompound(sumCompound / totalComments);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401 || err.response.status === 403) {
          console.log(err.response.message);
          setLoading(false);
          navigate('/login', { replace: true });
        } if (err.response.status === 404) {
          console.log(err.response.message);
          setLoading(false);
        } else {
          console.log(err);
          setLoading(false);
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <div
          className="svg-loader"
          style={{
            display: loading ? 'flex' : 'none'
          }}
        >
          <div>
            <div style={{
              textAlign: 'center',
              fontFamily: 'system-ui',
              fontSize: '20px',
              color: '#273854'
            }}
            >
              Please wait
            </div>
            <div style={{ marginTop: '5px' }}>
              <svg className="svg-containerr" height="160" width="160" viewBox="-2 -2 105 105">
                <circle className="loader-svg bg" cx="50" cy="50" r="45" />
                <circle className="loader-svg animate" cx="50" cy="50" r="45" />
              </svg>
            </div>
          </div>
        </div>

        <Container maxWidth={false} style={{ display: !loading ? 'block' : 'none' }}>
          <Grid container spacing={4}>
            <Grid item xl={4} lg={4} sm={6} xs={12}>
              <Positive percentage={positive} />
            </Grid>
            <Grid item xl={4} lg={4} sm={6} xs={12}>
              <Neutral percentage={neutral} />
            </Grid>
            <Grid item xl={4} lg={4} sm={6} xs={12}>
              <Negative percentage={negative} />
            </Grid>
            <Grid item lx={9} lg={8} md={12} xs={12}>
              <History isDashboard={Boolean} getSentiments={getSentiments} />
            </Grid>
            <Grid item xl={3} lg={4} md={6} xs={12}>
              <TrafficByDevice
                positive={positive}
                neutral={neutral}
                negative={negative}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
