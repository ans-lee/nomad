import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'src/Routes';
import 'src/styles/base.css';

const queryClient = new QueryClient();

const App = (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </QueryClientProvider>
);

ReactDOM.render(App, document.getElementById('root'));
