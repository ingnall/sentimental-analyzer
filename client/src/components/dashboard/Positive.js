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
import SentimentSatisfiedAlt from '@material-ui/icons/SentimentSatisfiedAlt';
import { toNumber } from 'lodash';

const Positive = (props) => {
  const { percentage } = { ...props };

  return (
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
              {percentage ? (percentage * 100).toFixed(1) : 0}
              %
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
              <SentimentSatisfiedAlt />
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

export default Positive;
