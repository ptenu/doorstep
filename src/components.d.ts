/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { MatchResults, RouterHistory } from "@stencil/router";
export namespace Components {
    interface AddressList {
        "history": RouterHistory;
    }
    interface AddressView {
        "history": RouterHistory;
        "match": MatchResults;
    }
    interface AppHome {
        "history": RouterHistory;
    }
    interface AppLogin {
        "history": RouterHistory;
    }
    interface AppRoot {
    }
}
declare global {
    interface HTMLAddressListElement extends Components.AddressList, HTMLStencilElement {
    }
    var HTMLAddressListElement: {
        prototype: HTMLAddressListElement;
        new (): HTMLAddressListElement;
    };
    interface HTMLAddressViewElement extends Components.AddressView, HTMLStencilElement {
    }
    var HTMLAddressViewElement: {
        prototype: HTMLAddressViewElement;
        new (): HTMLAddressViewElement;
    };
    interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {
    }
    var HTMLAppHomeElement: {
        prototype: HTMLAppHomeElement;
        new (): HTMLAppHomeElement;
    };
    interface HTMLAppLoginElement extends Components.AppLogin, HTMLStencilElement {
    }
    var HTMLAppLoginElement: {
        prototype: HTMLAppLoginElement;
        new (): HTMLAppLoginElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLElementTagNameMap {
        "address-list": HTMLAddressListElement;
        "address-view": HTMLAddressViewElement;
        "app-home": HTMLAppHomeElement;
        "app-login": HTMLAppLoginElement;
        "app-root": HTMLAppRootElement;
    }
}
declare namespace LocalJSX {
    interface AddressList {
        "history"?: RouterHistory;
    }
    interface AddressView {
        "history"?: RouterHistory;
        "match"?: MatchResults;
    }
    interface AppHome {
        "history"?: RouterHistory;
    }
    interface AppLogin {
        "history"?: RouterHistory;
    }
    interface AppRoot {
    }
    interface IntrinsicElements {
        "address-list": AddressList;
        "address-view": AddressView;
        "app-home": AppHome;
        "app-login": AppLogin;
        "app-root": AppRoot;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "address-list": LocalJSX.AddressList & JSXBase.HTMLAttributes<HTMLAddressListElement>;
            "address-view": LocalJSX.AddressView & JSXBase.HTMLAttributes<HTMLAddressViewElement>;
            "app-home": LocalJSX.AppHome & JSXBase.HTMLAttributes<HTMLAppHomeElement>;
            "app-login": LocalJSX.AppLogin & JSXBase.HTMLAttributes<HTMLAppLoginElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
        }
    }
}
