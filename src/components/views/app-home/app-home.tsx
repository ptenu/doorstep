import { Component, Host, h, State, Prop } from '@stencil/core';
import { request } from '../../../global/api';
import state from '../../../global/store';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  @State() searchType: string;
  @State() queryString: string;
  @State() possibleStreets: Array<any> = [];

  @Prop() history: RouterHistory;

  updateQuery(e) {
    this.queryString = e.detail;
  }

  search() {
    if (this.searchType == 'nearby') {
      this.searchNearby();
      return;
    }

    if (this.searchType == 'street') {
      this.searchStreets();
      return;
    }
    if (this.searchType == 'postcode') {
      request
        .get('/addresses', {
          params: {
            postcode: this.queryString,
          },
        })
        .then(response => {
          state.addressList = response.data;
          state.errorMessage = '';
          this.history.push('/addresses');
        })
        .catch(error => {
          if (error.response.status == 400) {
            state.errorMessage = 'That postcode you entered was not valid.';
            return error;
          }

          if (error.response.status == 404) {
            state.errorMessage = 'That postcode does not exist.';
            return error;
          }
          state.errorMessage = error.message;
        });
    }
  }

  searchNearby() {}

  searchStreets() {
    request
      .get('/streets', { params: { q: this.queryString } })
      .then(response => {
        let data: Array<any> = response.data;
        if (data.length == 0) {
          state.errorMessage = 'No streets were found.';
          return response;
        }

        if (data.length == 1) {
          this.setStreet(data[0].usrn);
          return;
        }

        this.possibleStreets = data;
      })
      .catch(error => {
        state.errorMessage = error.message;
        return error;
      });
  }

  setStreet(usrn: number) {
    request
      .get('/addresses', {
        params: { street: usrn },
      })
      .then(response => {
        state.addressList = response.data;
        state.errorMessage = '';
        this.history.push('/addresses');
      })
      .catch(error => {
        state.errorMessage = error.message;
        return error;
      });
  }

  searchTypes = [
    { key: 'nearby', label: 'Nearby', component: <p>This will request location permissions on your device.</p> },
    { key: 'street', label: 'Street Name', component: <text-input name="street-name" onChanged={e => this.updateQuery(e)} /> },
    { key: 'postcode', label: 'Postcode', component: <postcode-input name="postcode" onChanged={e => this.updateQuery(e)} /> },
  ];
  render() {
    return (
      <Host>
        <content-container>
          <header>
            <h1>Get started</h1>
          </header>
          <section>
            <alert-element dismissable={false}>The Doorstep App allows you to enter survey responses as you knock on doors or speak to people.</alert-element>

            <field-element useLabel={false} label="Search type">
              {this.searchTypes.map(type => (
                <div key={type.key}>
                  <toggle-input key={type.key} name="search-type" value={type.key} label={type.label} single onInput={_e => (this.searchType = type.key)} />
                  {this.searchType == type.key && <blockquote key={type.key}>{type.component}</blockquote>}
                </div>
              ))}
            </field-element>
            <button-control label="Search" theme="blue" onClick={() => this.search()} />
          </section>
          <footer>
            <p class="legal">Information communicated to you via this website is confidential and any data you access is to be used only the purposes permitted by the Union.</p>
            <p class="legal">Peterborough Tenants Union Ltd. </p>
            <aside class="small-box">
              <text-button onClick={() => (state.loggedIn = false)}>Log out</text-button>
            </aside>
          </footer>
        </content-container>

        {this.possibleStreets.length > 0 && (
          <aside class="ssel-wrapper">
            <div class="street-selector">
              <ul role="list">
                {this.possibleStreets.map(street => (
                  <li key={street.usrn}>
                    <text-button onClick={() => this.setStreet(street.usrn)}>
                      {street.description} - {street.admin_area} ({street.households || '0'} hh)
                    </text-button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </Host>
    );
  }
}
