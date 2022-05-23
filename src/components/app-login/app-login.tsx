import { Component, Host, h, Prop } from '@stencil/core';
import { request } from '../../global/api';
import state from '../../global/store';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.css',
})
export class AppLogin {
  @Prop() history: RouterHistory;

  componentWillLoad() {
    if (state.loggedIn) {
      this.history.push('/');
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    if (email == '' || password == '') {
      state.errorMessage = 'You must enter an email address and password.';
      return;
    }

    request
      .post('/session', {
        username: email,
        password,
      })
      .then(response => {
        if (response.status === 200) {
          // worked
          state.loggedIn = true;
          localStorage.setItem('SESSION_CREATED', Date.now().toLocaleString());
          this.history.push('/');
          state.errorMessage = '';
          return response;
        }

        state.loggedIn = false;

        // Some other error
        state.errorMessage = 'There was a problem trying to log you in. Please contact an administrator.';
      })
      .catch(error => {
        if (error.response.status === 404) {
          // Incorrect details
          state.errorMessage = 'The username or password provided was not correct.';
          return error;
        }

        // Some other error
        state.errorMessage = 'There was a problem trying to log you in. Please contact an administrator.';
      });
  }

  render() {
    return (
      <Host>
        <content-container>
          <header>
            <h1>Login</h1>
          </header>
          <section>
            <form onSubmit={e => this.handleSubmit(e)}>
              <field-element label="Email">
                <text-input name="email" autoComplete="email" />
              </field-element>

              <field-element label="Password">
                <text-input name="password" autoComplete="password" type="password" />
              </field-element>
              <button-control label="Sign in" />
            </form>
          </section>
          <footer>
            <p>
              If you can't remember your login details, you can <nav-link target="https://recover.peterboroughtenants.app">reset your password here.</nav-link>
            </p>
          </footer>
        </content-container>
      </Host>
    );
  }
}
