import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  useTheme
} from '@material-ui/core';
import SentimentSatisfiedAlt from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentNeutral from '@material-ui/icons/SentimentNeutral';
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied';

const TrafficByDevice = (props) => {
  const { positive, neutral, negative } = { ...props };
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [(positive * 100).toFixed(1), (negative * 100).toFixed(1), (neutral * 100).toFixed(1)],
        backgroundColor: [
          colors.green[600],
          colors.red[600],
          colors.orange[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Positive', 'Negative', 'Neutral']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const comment = [
    {
      title: 'Positive',
      value: (positive * 100).toFixed(1),
      icon: SentimentSatisfiedAlt,
      color: colors.green[600]
    },
    {
      title: 'Neutral',
      value: (neutral * 100).toFixed(1),
      icon: SentimentNeutral,
      color: colors.orange[600]
    },
    {
      title: 'Negative',
      value: (negative * 100).toFixed(1),
      icon: SentimentVeryDissatisfied,
      color: colors.red[600]
    }
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Graphical Representation" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 250,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {comment.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h2"
              >
                {value}
                %
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrafficByDevice;
