import { Component, Host, h, Prop } from '@stencil/core';
import state from '../../../global/store';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'address-list',
  styleUrl: 'address-list.css',
})
export class AddressList {
  @Prop() history: RouterHistory;

  back() {
    sessionStorage.removeItem('addresses');
    state.addressList = [];
    this.history.push('/');
  }
  render() {
    return (
      <Host>
        <content-container>
          <header class="sticky">
            <h1>Addresses ({state.addressList.length})</h1>
          </header>
          <section>
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
