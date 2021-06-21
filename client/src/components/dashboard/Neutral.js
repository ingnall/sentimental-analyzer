import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import SentimentNeutral from '@material-ui/icons/SentimentNeutral';
import { toNumber } from 'lodash';

const Neutral = (props) => {
  const { percentage } = { ...props };

  return (
    <Card
      sx={{ height: '100%' }}
      {...props}
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
              NEUTRAL
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
                backgroundColor: orange[600],
                height: 56,
                width: 56
              }}
            >
              <SentimentNeutral />
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

export default Neutral;
