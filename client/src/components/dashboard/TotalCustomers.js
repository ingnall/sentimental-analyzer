import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

const TotalCustomers = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            POSITIVE
          </Typography>
          <Typography
            color="textPrimary"
            variant="h3"
          >
            40.1%
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: green[600],
              height: 56,
              width: 56
            }}
          >
            <PeopleIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          value={30}
          variant="determinate"
        />
      </Box>
    </CardContent>
  </Card>
);

export default TotalCustomers;
