import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
// import { Provider } from 'react-redux';
// import store from './store';
import GlobalStyles from './components/GlobalStyles';
import './mixins/chartjs';
import theme from './theme';
import routes from './routes';

const App = () => {
  const routing = useRoutes(routes);

  return (
    // <Provider store={store}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
    // </Provider>
  );
};

export default App;
