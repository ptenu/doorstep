import { h } from '@stencil/core';
import axios from 'axios';
import state from './store';

let nextClientId: string;
if (localStorage.getItem('X-CLIENT-ID') != null) {
  nextClientId = localStorage.getItem('X-CLIENT-ID');
}

const request = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

// Handle getting and setting the client ID
request.interceptors.request.use(config => {
  config.headers['x-client-id'] = nextClientId;
  return config;
});

request.interceptors.response.use(response => {
  nextClientId = response.headers['x-client-id'];
  localStorage.setItem('X-CLIENT-ID', nextClientId);

  return response;
});

request.interceptors.response.use(response => {
  if (response.status == 401) {
    state.loggedIn = false;
  }

  return response;
});

/****** PRIVATE ROUTE */
const PrivateRoute = ({ component, ...props }: { [key: string]: any }) => {
  const Component = component;
  const redirectUrl = '/login';

  if (!state.loggedIn) {
    state.errorMessage = 'You must be logged in to view this page.';
  }

  return (
    <stencil-route
      {...props}
      routeRender={(props: { [key: string]: any }) => {
        if (state.loggedIn) {
          return <Component {...props} {...props.componentProps}></Component>;
        }
        return <stencil-router-redirect url={redirectUrl}></stencil-router-redirect>;
      }}
    />
  );
};

export { request, PrivateRoute };
