import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import History from '../components/dashboard/History';
// import customers from '../__mocks__/customers';
// import CustomerListResults from '../components/customer/CustomerListResults';
// import CustomerListToolbar from '../components/customer/CustomerListToolbar';

const PostUrls = () => (
  <>
    <Helmet>
      <title>Customers | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            xl={9}
            lg={12}
            md={12}
            xs={12}
          >
            <History />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default PostUrls;
