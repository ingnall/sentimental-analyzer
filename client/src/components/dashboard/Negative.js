import {
  Avatar,
  Card,
  Box,
  LinearProgress,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied';
import { toNumber } from 'lodash';

const Negative = (props) => {
  const { percentage } = { ...props };

  return (
    <Card
      sx={{ height: '100%' }}
    // {...props}
    >
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
              NEGATIVE
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {percentage ? (percentage * 100).toFixed(1) : 0}
              %
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: red[600],
                height: 56,
                width: 56
              }}
            >
              <SentimentVeryDissatisfied />
            </Avatar>
          </Grid>
        </Grid>
        <Box sx={{ pt: 3 }}>
          <LinearProgress
            value={toNumber(percentage ? (percentage * 100).toFixed(1) : 0)}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Negative;
