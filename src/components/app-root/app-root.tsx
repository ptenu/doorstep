import { Component, h, Host } from '@stencil/core';
import 'ptu-elements';
import { PrivateRoute } from '../../global/api';
import state from '../../global/store';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  render() {
    return (
      <Host>
        <main>
          <content-container id="app-header">
            <section>PTU Doorstep</section>
          </content-container>
          {state.errorMessage != '' && (
            <content-container>
              <alert-element dismissable={false} theme="danger">
                {state.errorMessage}
              </alert-element>
            </content-container>
          )}
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <PrivateRoute url="/" component="app-home" exact={true} />
              <stencil-route url="/login" component="app-login" />
            </stencil-route-switch>
          </stencil-router>
        </main>
      </Host>
    );
  }
}
