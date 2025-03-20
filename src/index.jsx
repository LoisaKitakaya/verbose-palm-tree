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
import Orders from "./routes/seller/orders";
import Shipments from "./routes/seller/shipments/shipments";
import Analytics from "./routes/seller/analytics";
import Reports from "./routes/seller/Reports";
import Collections from "./routes/seller/collections";
import Reviews from "./routes/seller/reviews";

render(
  () => (
    <MetaProvider>
      <Router root={App}>
        <Route path="*404" component={NotFound} />

        <Route path="/" component={Home} />

        <Route path="/filter" component={Filter} />

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

        <Route path="/store">
          <Route path="/products" component={Seller} />
          <Route path="/products/:product_id" component={SellerProduct} />
          <Route path="/products/collections" component={Collections} />
          <Route path="/products/reviews" component={Reviews} />
          <Route path="/orders" component={Orders} />
          <Route path="/orders/shipments" component={Shipments} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/analytics/reports" component={Reports} />
        </Route>
      </Router>
    </MetaProvider>
  ),
  root
);
