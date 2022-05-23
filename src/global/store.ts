import { createStore } from '@stencil/store';
import { request } from './api';

const { state, onChange } = createStore({
  currentAddress: {},
  currentStreet: null,
  addressList: [],
  searchQuery: '',
  responses: [],
  loggedIn: false,
  errorMessage: '',
  position: {
    longitude: 0,
    latitude: 0,
  },
  gpsId: 0,
});

onChange('addressList', newList => {
  const list = JSON.stringify(newList);
  sessionStorage.setItem('addresses', list);
});

onChange('loggedIn', newValue => {
  if (newValue == false) {
    localStorage.removeItem('SESSION_CREATED');
    localStorage.removeItem('X-CLIENT-ID');
  }

  if (newValue == true) {
    if (localStorage.getItem('X-CLIENT-ID') == null) {
      state.loggedIn == false;
    }
  }
});

onChange('position', newPosition => {
  request
    .get('/addresses', {
      params: {
        near: newPosition.latitude + ',' + newPosition.longitude,
      },
    })
    .then(response => {
      state.addressList = response.data;
    });
});

export default state;
