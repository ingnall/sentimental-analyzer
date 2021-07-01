/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  makeStyles,
  Box,
  Container,
  Collapse,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import Negative from '../components/dashboard/Negative';
import Positive from '../components/dashboard/Positive';
import Neutral from '../components/dashboard/Neutral';
import TrafficByDevice from '../components/dashboard/TrafficByDevice';
import './analyzer.css';

const Analyzer = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyze, setAnalyze] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [notFbPage, setNotFbPage] = useState(false);
  const [positive, setPositive] = useState(0.333);
  const [neutral, setNeutral] = useState(0.333);
  const [negative, setNegative] = useState(0.333);
  const [comments, setComments] = useState([]);
  const [radioValue, setRadioValue] = useState('database');

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset'
      }
    }
  });

  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 450,
    },
  });

  const handleAnalyze = (URL) => {
    if (URL) {
      setError('');
      setLoading(true);
      setAnalyze(true);

      if (radioValue === 'database') {
        axios.get('http://localhost:5000/api/posts/find', {
          headers: {
            'Access-Control-Allow-Origin': true,
            'x-access-token': localStorage.getItem('token')
          },
          params: {
            id: URL,
            userId: localStorage.getItem('userId'),
            loginWithFB: localStorage.getItem('loginWithFB')
          }
        })
          .then((findPostResponse) => {
            setComments(findPostResponse.data.comments);

            const totalComments = findPostResponse.data.comments.length;
            let sumPositive = 0;
            let sumNeutral = 0;
            let sumNegative = 0;
            for (let i = 0; i < findPostResponse.data.comments.length; i++) {
              sumPositive += findPostResponse.data.comments[i].object.pos;
              sumNeutral += findPostResponse.data.comments[i].object.neu;
              sumNegative += findPostResponse.data.comments[i].object.neg;
            }
            setPositive(sumPositive / totalComments);
            setNeutral(sumNeutral / totalComments);
            setNegative(sumNegative / totalComments);
            setLoading(false);
          })
          .catch((findPostError) => {
            if (findPostError.response.status === 401 || findPostError.response.status === 403) {
              console.log(findPostError.response.data.message);
              setLoading(false);
              navigate('/login', { replace: true });
            } if (findPostError.response.status === 404) {
              console.log(findPostError.response.data.message);

              axios.post(`http://localhost:8000/?data=${URL}`)
                .then((djangoRes) => {
                  console.log(djangoRes);
                  const objects = Object.values(djangoRes.data);
                  const array = Object.keys(djangoRes.data).map((key, index) => (
                    { name: key, object: objects[index] }
                  ));
                  console.log(array);
                  if (!array.length) {
                    setError('URL is not correct OR post does not have any comment');
                    setLoading(false);
                  } else {
                    setComments(array);

                    const totalComments = array.length;
                    let sumPositive = 0;
                    let sumNeutral = 0;
                    let sumNegative = 0;
                    for (let i = 0; i < array.length; i++) {
                      sumPositive += array[i].object.pos;
                      sumNeutral += array[i].object.neu;
                      sumNegative += array[i].object.neg;
                    }
                    setPositive(sumPositive / totalComments);
                    setNeutral(sumNeutral / totalComments);
                    setNegative(sumNegative / totalComments);
                    setLoading(false);

                    // Save result in MongoDB
                    axios.post('http://localhost:5000/api/posts/save', {
                      id: URL,
                      userId: localStorage.getItem('userId'),
                      comments: array,
                      loginWithFB: localStorage.getItem('loginWithFB')
                    }, {
                      headers: {
                        'Access-Control-Allow-Origin': true,
                        'x-access-token': localStorage.getItem('token'),
                      }
                    })
                      .then((nodeRes) => {
                        console.log(nodeRes.data);
                      })
                      .catch((err) => {
                        console.log(err.response);
                        if (err.response.status === 400) {
                          console.log(err.response.data.message);
                        } if (err.response.status === 401 || err.response.status === 403) {
                          console.log(err.response.data.message);
                          navigate('/login', { replace: true });
                        }
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setError('Server error');
                  setLoading(false);
                  setAnalyze(false);
                });
            }
          });
      } else if (radioValue === 'reanalyze') {
        axios.post(`http://localhost:8000/?data=${postUrl}`)
          .then((djangoRes) => {
            const objects = Object.values(djangoRes.data);
            const array = Object.keys(djangoRes.data).map((key, index) => (
              { name: key, object: objects[index] }
            ));
            if (!array.length) {
              setError('URL is not correct OR post does not have any comment');
              setLoading(false);
            } else {
              setComments(array);

              const totalComments = array.length;
              let sumPositive = 0;
              let sumNeutral = 0;
              let sumNegative = 0;
              for (let i = 0; i < array.length; i++) {
                sumPositive += array[i].object.pos;
                sumNeutral += array[i].object.neu;
                sumNegative += array[i].object.neg;
              }
              setPositive(sumPositive / totalComments);
              setNeutral(sumNeutral / totalComments);
              setNegative(sumNegative / totalComments);
              setLoading(false);

              // Save result in MongoDB
              axios.post('http://localhost:5000/api/posts/save', {
                id: postUrl,
                userId: localStorage.getItem('userId'),
                comments: array,
                loginWithFB: localStorage.getItem('loginWithFB')
              }, {
                headers: {
                  'Access-Control-Allow-Origin': true,
                  'x-access-token': localStorage.getItem('token'),
                }
              })
                .then((nodeRes) => {
                  console.log(nodeRes.data);
                })
                .catch((err) => {
                  if (err.response.status === 400) {
                    console.log(err.response.data.message);
                  } if (err.response.status === 401 || err.response.status === 403) {
                    console.log(err.response.data.message);
                    navigate('/login', { replace: true });
                  }
                });
            }
          })
          .catch((err) => {
            console.log(err);
            setError('Server error');
            setLoading(false);
            setAnalyze(false);
          });
      }
    }
  };

  const checkURL = () => {
    let URL = postUrl;
    if (URL.includes('https://m.facebook.com/')) {
      setPostUrl(URL);
      handleAnalyze(URL);
    } else if (URL.includes('https://www.facebook.com/')) {
      URL = URL.replace('www.', 'm.');
      setPostUrl(URL);
      handleAnalyze(URL);
    } else {
      setNotFbPage(true);
    }
  };

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
    }).then(() => {
      navigator.clipboard.readText().then((text) => {
        if (text.includes('https://m.facebook.com/')) {
          setPostUrl(text);
        } else if (text.includes('https://www.facebook.com/')) {
          setPostUrl(text.replace('www.', 'm.'));
        }
      }).then(() => {
        if (postUrl) { handleAnalyze(); }
      });
    }).catch((err) => {
      if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
        console.log(err.response.data.message);
        navigate('/login', { replace: true });
      }
    });
  }, []);

  function Row(props) {
    const {
      name,
      positivePercentage,
      neutralPercentage,
      negativePercentage,
      compound,
      comment
    } = { ...props };
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (
      <>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            style={{
              color: compound >= 0.05 ? '#43a047' : compound <= -0.05 ? '#e53935' : '#fb8c00'
            }}
          >
            {name}
          </TableCell>
          <TableCell>
            {positivePercentage}
            %
          </TableCell>
          <TableCell>
            {neutralPercentage}
            %
          </TableCell>
          <TableCell>
            {negativePercentage}
            %
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Comment
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <TableRow key={name}>
                      <TableCell>
                        {comment}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Products | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 0
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Box>
                      <TextField
                        fullWidth
                        placeholder="Paste URL"
                        variant="outlined"
                        onChange={(e) => {
                          setNotFbPage(false);
                          setPostUrl(e.target.value);
                        }}
                        value={postUrl}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            checkURL();
                          }
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={2}>
                    <Box style={{ height: '100%' }}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={checkURL}
                        style={{
                          width: '100%',
                          height: '100%',
                          fontSize: '20px',
                          fontFamily: 'Roboto'
                        }}
                      >
                        Analyze
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={radioValue}
                      onChange={(e) => setRadioValue(e.target.value)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                      }}
                    >
                      <FormControlLabel
                        value="database"
                        control={<Radio />}
                        label="First check database if the result is stored (reanalyze if not stored)"
                      />
                      <FormControlLabel
                        value="reanalyze"
                        control={<Radio />}
                        label="Reanalyze the post without checking database"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Container>

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
              <svg className="svg-containerr" height="160" width="160" viewBox="-2 -2 110 110">
                <circle className="loader-svg bg" cx="50" cy="50" r="45" />
                <circle className="loader-svg animate" cx="50" cy="50" r="45" />
              </svg>
            </div>
          </div>
        </div>

        <Typography
          style={{
            display: !loading && !analyze && error.length ? 'block' : 'none',
            textAlign: 'center',
            marginTop: '40px'
          }}
        >
          {error}
        </Typography>

        <Typography
          style={{
            display: notFbPage ? 'block' : 'none',
            textAlign: 'center',
            marginTop: '40px'
          }}
        >
          Provided URL is not of facebook post
        </Typography>

        {/* <Typography
          style={{
            display: (!loading && error.length) ? 'block' : 'none',
            textAlign: 'center',
            marginTop: '40px'
          }}
        >
          Error:
          {' '}
          {error}
        </Typography> */}

        <Container maxWidth={false} style={{ display: !loading && analyze && !error.length ? 'block' : 'none' }}>
          <Box marginY="30px">
            <Grid
              container
              spacing={4}
            >
              <Grid
                item
                lg={4}
                sm={6}
                xl={3}
                xs={12}
              >
                <Positive percentage={positive} />
              </Grid>
              <Grid
                item
                lg={4}
                sm={6}
                xl={3}
                xs={12}
              >
                <Neutral percentage={neutral} />
              </Grid>
              <Grid
                item
                lg={4}
                sm={6}
                xl={3}
                xs={12}
              >
                <Negative percentage={negative} />
              </Grid>
              <Grid
                item
                xl={9}
                lg={8}
                md={6}
                xs={12}
              >
                <Box height="100%">
                  <Card>
                    <CardContent>
                      <Typography color="primary" variant="h3">Comments</Typography>
                    </CardContent>

                    <Box>
                      <Paper className={classes.root}>
                        <TableContainer className={classes.container}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <TableCell />
                                <TableCell>Name</TableCell>
                                <TableCell>Positive</TableCell>
                                <TableCell>Neutral</TableCell>
                                <TableCell>Negative</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {comments.length
                                ? comments.map((comment) => (
                                  <Row
                                    key={comment.name}
                                    name={comment.name}
                                    positivePercentage={(comment.object.pos * 100).toFixed(1)}
                                    neutralPercentage={(comment.object.neu * 100).toFixed(1)}
                                    negativePercentage={(comment.object.neg * 100).toFixed(1)}
                                    compound={comment.object.compound}
                                    comment={comment.object.val}
                                  />
                                ))
                                : (
                                  <TableRow>
                                    <TableCell />
                                    <TableCell>Something is wrong with URL.</TableCell>
                                  </TableRow>
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  </Card>
                </Box>
              </Grid>
              <Grid item xl={3} lg={4} md={6} xs={12}>
                <TrafficByDevice
                  positive={positive}
                  neutral={neutral}
                  negative={negative}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Analyzer;
