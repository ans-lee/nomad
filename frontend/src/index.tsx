import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'src/Routes';
import 'src/styles/base.css';

const queryClient = new QueryClient();
setLogger({
  log: () => {}, // eslint-disable-line
  warn: () => {}, // eslint-disable-line
  error: () => {}, // eslint-disable-line
});

const App = (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </QueryClientProvider>
);

ReactDOM.render(App, document.getElementById('root'));
