/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';

const History = (props) => {
  const { isDashboard, getSentiments } = { ...props };
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts', {
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
        setPosts(Object.values(res.data));
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            console.log(err.response.message);
            navigate('/login', { replace: true });
          } if (err.response.status === 404) {
            console.log(err.response.message);
          }
        } else {
          console.log(err);
        }
      });
  }, []);

  const reviewPostComments = (postId) => {
    navigator.clipboard.writeText((postId).toString());
    navigate('/app/analyzer', { replace: true });
  };

  return (
    <Card>
      <CardContent>
        <Typography color="primary" variant="h3">Post URLs</Typography>
      </CardContent>
      <Divider />
      <Box sx={{ minWidth: 686 }}>
        <Table>
          <TableBody>
            {posts.length ? posts.map((post) => (
              <TableRow hover key={post.id}>
                <TableCell>
                  <Typography
                    style={{
                      width: !isDashboard ? '66vw' : '30vw',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {post.id}
                  </Typography>
                </TableCell>

                {isDashboard
                  ? (
                    <TableCell>
                      <Button
                        variant="contained"
                        style={{
                          width: '100%',
                          fontSize: '12px',
                          fontFamily: 'system-ui'
                        }}
                        onClick={() => { if (isDashboard) getSentiments(post.id); }}
                      >
                        Average
                      </Button>
                    </TableCell>
                  ) : <></>}

                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      width: '100%',
                      fontSize: '12px',
                      fontFamily: 'system-ui'
                    }}
                    onClick={() => reviewPostComments(post.id)}
                  >
                    Reanalyze
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell>No facebook post is analyzed yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </Box>
    </Card>
  );
};

export default History;
