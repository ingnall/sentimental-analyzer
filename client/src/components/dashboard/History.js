// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  // Button,
  Card,
  // CardHeader,
  CardContent,
  Typography,
  // Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  // TableHead,
  TableRow,
  // TableSortLabel,
  // Tooltip
} from '@material-ui/core';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// eslint-disable-next-line no-unused-vars
const orders = [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'Analyze'
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'refunded'
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    createdAt: 1554757200000,
    status: 'Analyze'
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  }
];

const History = (props) => {
  const properties = { ...props };
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts', {
      headers: {
        'Access-Control-Allow-Origin': true,
        'x-access-token': localStorage.getItem('token')
      }
    })
      .then((res) => {
        console.log(res.data);
        setPosts(Object.values(res.data));
      })
      .catch((err) => {
        if (err.response.status === 401 || err.response.status === 403) {
          console.log(err.response.message);
          navigate('/login', { replace: true });
        } if (err.response.status === 404) {
          console.log(err.response.message);
        } else {
          console.log(err);
        }
      });
  }, []);

  return (
    <Card {...props}>
      {/* <CardHeader
      title="History"
      style={{
        color: '#5664d2',
        fontSize: '24px'
      }}
    /> */}
      <CardContent>
        <Typography color="primary" variant="h3">Post URLs</Typography>
      </CardContent>
      <Divider />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            {/* <TableHead>
              <TableRow>
                <TableCell>
                  Post URLs
                </TableCell>
                <TableCell>
                User Name
              </TableCell>
              <TableCell sortDirection="asc">
                <Tooltip
                  enterDelay={300}
                  title="Sort"
                >
                  <TableSortLabel
                    active
                    direction="asc"
                  >
                    Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                Status
              </TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {posts.length ? posts.map((post) => (
                <TableRow
                  hover
                  key={post.id}
                >
                  <TableCell style={{ cursor: 'pointer' }}>
                    <div
                      role="button"
                      tabIndex={post.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => { if (properties.isDashboard) properties.getSentiments(post.id); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && properties.isDashboard) properties.getSentiments(post.id); }}
                    >
                      {post.id}
                    </div>
                  </TableCell>
                  {/* <TableCell>
                  {order.customer.name}
                </TableCell>
                <TableCell>
                  {moment(order.createdAt).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>
                  <Chip
                    color="primary"
                    label={order.status}
                    size="small"
                  />
                </TableCell> */}
                </TableRow>
              )) : ''}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      {/* <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box> */}
    </Card>
  );
};

export default History;
