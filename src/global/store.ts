import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  currentAddress: {},
  currentStreet: {},
  addressList: [],
  searchQuery: '',
  responses: [],
  loggedIn: false,
  errorMessage: '',
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

export default state;
