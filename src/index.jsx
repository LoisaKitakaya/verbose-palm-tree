/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import "quill/dist/quill.snow.css"; // Choose "bubble" or "core" for different themes

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

import App from "./App";
import Home from "./routes";
import Seller from "./routes/seller";
import { MetaProvider } from "@solidjs/meta";
import NotFound from "./routes/404";
import SingIn from "./routes/auth/sign-in";
import SignUp from "./routes/auth/sign-up";
import CreateAccount from "./routes/auth/create-account";
import TermsAndConditions from "./routes/terms-and-conditions";
import PrivacyPolicy from "./routes/privacy-policy";
import Account from "./routes/account";
import SellerProduct from "./routes/seller/product";
import Filter from "./routes/filter";
import RequestPasswordReset from "./routes/auth/security/request-password-reset";
import Store from "./routes/store";
import Product from "./routes/store/product";
import Favorites from "./routes/buyer";

render(
  () => (
    <MetaProvider>
      <Router root={App}>
        <Route path="*404" component={NotFound} />

        <Route path="/" component={Home} />

        <Route path="/filter" component={Filter} />

        <Route path="/favorites-orders" component={Favorites} />

        <Route path="/terms-and-conditions" component={TermsAndConditions} />

        <Route path="/privacy-policy" component={PrivacyPolicy} />

        <Route path="/account">
          <Route path="/" component={Account} />
        </Route>

        <Route path="/auth">
          <Route path="/sign-in" component={SingIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/create-account" component={CreateAccount} />
          <Route
            path="/security/request-password-reset"
            component={RequestPasswordReset}
          />
        </Route>

        <Route path="/seller">
          <Route path="/" component={Seller} />
          <Route path="/product/:product_id" component={SellerProduct} />
        </Route>
        
        <Route path="/store">
          <Route path="/:store_slug" component={Store} />
          <Route path="/product/:product_id" component={Product} />
        </Route>
      </Router>
    </MetaProvider>
  ),
  root
);
