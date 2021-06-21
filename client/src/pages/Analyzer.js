import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  // Pagination
} from '@material-ui/core';
// import ProductListToolbar from '../components/product/ProductListToolbar';
import Negative from '../components/dashboard/Negative';
import Positive from '../components/dashboard/Positive';
import Neutral from '../components/dashboard/Neutral';
import TrafficByDevice from '../components/dashboard/TrafficByDevice';
import './analyzer.css';
// import ProductCard from '../components/product/ProductCard';
// import products from '../__mocks__/products';

const Analyzer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyze, setAnalyze] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [sentimentIndex, setSentimentIndex] = useState(0);

  const handleAnalyze = () => {
    if (postUrl) {
      setLoading(true);
      setAnalyze(true);

      axios.get(`http://localhost:5000/api/posts/find/?id=${postUrl}`, {
        headers: {
          'Access-Control-Allow-Origin': true,
          'x-access-token': localStorage.getItem('token')
        }
      })
        .then((findPostResponse) => {
          console.log(findPostResponse.data);
          setComments(findPostResponse.data.comments);
          setLoading(false);
        })
        .catch((findPostError) => {
          if (findPostError.response.status === 401 || findPostError.response.status === 403) {
            console.log(findPostError.response.message);
            setLoading(false);
            navigate('/login', { replace: true });
          } if (findPostError.response.status === 404) {
            console.log(findPostError.response.message);

            axios.post(`http://localhost:8000/?data=${postUrl}`)
              .then((djangoRes) => {
                console.log(djangoRes);
                const objects = Object.values(djangoRes.data);
                const array = Object.keys(djangoRes.data).map((key, index) => (
                  { name: key, object: objects[index] }
                ));
                console.log(array);
                setComments(array);
                setLoading(false);

                // Save result in MongoDB
                axios.post('http://localhost:5000/api/posts/save', {
                  id: postUrl,
                  comments: array
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
                      console.log(err.response.message);
                    } if (err.response.status === 401 || err.response.status === 403) {
                      console.log(err.response.message);
                      navigate('/login', { replace: true });
                    }
                  });
              })
              .catch((err) => {
                console.log(err.response);
                setLoading(false);
                setAnalyze(false);
              });
          }
        });
    }
  };

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
              <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box style={{ width: '85%' }}>
                  <TextField
                    fullWidth
                    placeholder="Paste URL"
                    variant="outlined"
                    onChange={(e) => setPostUrl(e.target.value)}
                    value={postUrl}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAnalyze();
                      }
                    }}
                  />
                </Box>
                <Box style={{ width: '13.5%' }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleAnalyze}
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

        <Container maxWidth={false} style={{ display: !loading && analyze ? 'block' : 'none' }}>
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
                <Positive percentage={comments.length ? comments[sentimentIndex].object.pos : 0} />
              </Grid>
              <Grid
                item
                lg={4}
                sm={6}
                xl={3}
                xs={12}
              >
                <Neutral percentage={comments.length ? comments[sentimentIndex].object.neu : 0} />
              </Grid>
              <Grid
                item
                lg={4}
                sm={6}
                xl={3}
                xs={12}
              >
                <Negative percentage={comments.length ? comments[sentimentIndex].object.neg : 0} />
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
                      {comments.length
                        ? comments.map((comment, index) => (
                          <div
                            key={comment.name}
                            className="name"
                            role="button"
                            tabIndex={index}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSentimentIndex(index)}
                            onKeyDown={() => setSentimentIndex(index)}
                          >
                            <Divider />
                            <Typography color="textPrimary" variant="h5" marginTop="10px">{comment.name}</Typography>
                          </div>
                        )) : ''}
                    </CardContent>
                  </Card>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 3
                  }}
                >
                  {/* <Pagination
                    color="primary"
                    count={3}
                    size="small"
                  /> */}
                </Box>
              </Grid>
              <Grid
                item
                xl={3}
                lg={4}
                md={6}
                xs={12}
              >
                <TrafficByDevice
                  positive={comments.length ? comments[sentimentIndex].object.pos : 0}
                  neutral={comments.length ? comments[sentimentIndex].object.neu : 0}
                  negative={comments.length ? comments[sentimentIndex].object.neg : 0}
                />
              </Grid>
            </Grid>
          </Box>
          {/* <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {products.map((product) => (
              <Grid
                item
                key={product.id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box> */}
        </Container>
      </Box>
    </>
  );
};

export default Analyzer;
