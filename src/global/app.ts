import state from './store';

/** Global script */
export default async () => {
  const statusFromLocalStorage = localStorage.getItem('SESSION_CREATED');
  const xClientId = localStorage.getItem('X-CLIENT-ID');

  if (statusFromLocalStorage != null && xClientId != null) {
    state.loggedIn = true;
  } else {
    console.log('NOT ACTIVE');
  }
};
