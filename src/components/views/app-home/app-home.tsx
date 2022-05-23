import { Component, Host, h, State } from '@stencil/core';
import state from '../../../global/store';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {
  @State() searchType: string;
  @State() queryString: string;

  updateQuery(e) {
    this.queryString = e.detail;
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
            <alert-element dismissable={false}>The Doorstep App allows you to enter survey responses as you knock on doors or speak to people.</alert-element>
          </header>
          <section>
            <field-element useLabel={false} label="Search type">
              {this.searchTypes.map(type => (
                <div key={type.key}>
                  <toggle-input key={type.key} name="search-type" value={type.key} label={type.label} single onInput={_e => (this.searchType = type.key)} />
                  {this.searchType == type.key && <blockquote key={type.key}>{type.component}</blockquote>}
                </div>
              ))}
            </field-element>
            <button-control label="Search" theme="blue" />
          </section>
          <footer>
            <p class="legal">Information communicated to you via this website is confidential and any data you access is to be used only the purposes permitted by the Union.</p>
            <p class="legal">Peterborough Tenants Union Ltd. </p>
            <aside class="small-box">
              <text-button onClick={() => (state.loggedIn = false)}>Log out</text-button>
            </aside>
          </footer>
        </content-container>
      </Host>
    );
  }
}
