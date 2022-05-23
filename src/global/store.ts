import { createStore } from '@stencil/store';
import { request } from './api';

/*
"P": SurveyReturn.TenureTypes.PRIVATE_RENT,
"S": SurveyReturn.TenureTypes.SOCIAL_RENT,
"L": SurveyReturn.TenureTypes.LICENSEE,
"O": SurveyReturn.TenureTypes.OWNER_OCCUPIER,
"H": SurveyReturn.TenureTypes.HMO,
"U": SurveyReturn.TenureTypes.OTHER,
*/

const { state, onChange } = createStore({
  currentAddress: {},
  currentStreet: null,
  addressList: [],
  searchQuery: '',
  responses: [],
  loggedIn: false,
  requestParams: null,
  errorMessage: '',
  position: {
    longitude: 0,
    latitude: 0,
  },
  gpsId: 0,
  questions: [
    {
      label: 'Answered',
      description: 'Did they answer the door?',
      name: 'answered',
      values: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      label: 'Current tenure',
      description: 'What are the current circumstances of the occupiers?',
      name: 'tenure',
      values: [
        {
          value: 'S',
          label: 'Social Rent',
        },
        { value: 'P', label: 'Private Rent' },
        { value: 'L', label: 'Licensee' },
        { value: 'O', label: 'Owner occupier' },
        { value: 'U', label: 'Other' },
      ],
    },
    {
      label: 'Previous situation',
      description: 'Has the person you are talking to rented before?',
      name: 'previously_rented',
      values: [
        { value: 'Y', label: 'Yes' },
        { value: 'N', label: 'No' },
        { value: 'X', label: "Won't say" },
      ],
    },
    {
      label: 'Suspected HMO',
      description: 'Is the property (or does it appear to be) a HMO?',
      name: 'hmo',
      values: [
        { value: 'S', label: 'Suspected' },
        { value: 'Y', label: 'Confirmed' },
        { value: 'N', label: 'No' },
      ],
    },
  ],
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
  state.requestParams = {
    near: newPosition.latitude + ',' + newPosition.longitude,
  };
  state.errorMessage = '';

  request
    .get('/addresses', {
      params: state.requestParams,
    })
    .then(resp => {
      state.addressList = resp.data;
    })
    .catch(error => {
      try {
        state.errorMessage = error.response.data.description;
      } catch {
        state.errorMessage = error.message;
      }
    });
});

export default state;
