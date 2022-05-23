import { Component, Host, h, Prop, State } from '@stencil/core';
import state from '../../../global/store';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'address-list',
  styleUrl: 'address-list.css',
})
export class AddressList {
  @Prop() history: RouterHistory;
  @State() restored: boolean = false;

  componentWillLoad() {
    if (state.gpsId == 0 && state.currentStreet == null && state.searchQuery == '') {
      this.restored = true;
    }
  }

  HeaderText() {
    if (state.gpsId !== 0) {
      return <h1>Nearby Addresses ({state.addressList.length})</h1>;
    }

    if (state.currentStreet !== null) {
      return (
        <h1>
          {state.currentStreet.description} ({state.addressList.length})
        </h1>
      );
    }

    if (state.searchQuery != '') {
      return (
        <h1>
          {state.searchQuery} ({state.addressList.length})
        </h1>
      );
    }
    return <h1>Addresses ({state.addressList.length})</h1>;
  }

  back() {
    state.addressList = [];
    sessionStorage.removeItem('addresses');
    navigator.geolocation.clearWatch(state.gpsId);
    state.currentStreet = null;
    state.searchQuery = '';
    this.history.push('/');
  }
  render() {
    return (
      <Host>
        <content-container>
          <header class="sticky">
            <this.HeaderText />
          </header>
          <section>
            {state.gpsId !== 0 && <alert-element dismissable={false}>Your location (and this list) will update automaticaly as you move around.</alert-element>}
            {this.restored && (
              <alert-element dismissable={false} theme="warning">
                These addresses were restored from the cache; if you were viewing nearby addresses, your GPS location will no longer update automaticaly.
              </alert-element>
            )}

            <ul role="list">
              {state.addressList.map(address => (
                <li>
                  <button class="address-button">
                    <header>{address.single_line}</header>
                    <p>{address.classification}</p>
                    {address.last_visit && (
                      <p>
                        Last visited on {address.last_visit.date} by {address.last_visit.visited_by}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <footer class="sticky">
            <button-control theme="light" label="Back" tight onClick={() => this.back()} />
          </footer>
        </content-container>
      </Host>
    );
  }
}
