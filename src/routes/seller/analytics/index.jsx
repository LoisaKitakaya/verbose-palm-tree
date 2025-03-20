import Cookies from "js-cookie";
import { useSearchParams } from "@solidjs/router";
import {
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Switch,
} from "solid-js";
import { backendAPI } from "../../../lib/utils/secrets";
import MetaTitle from "../../../components/meta/meta-title";
import { getErrorMessage } from "../../../lib/utils/responses";
import Container from "../../../components/layout/app/container";
import BuyerLimitation from "../../../components/auth/buyer_limitation";
import RouteProtection from "../../../components/auth/route_protection";
import { openModal } from "../../../lib/store/modal_store";
import CreateProduct from "../../../components/seller/create_product";
import { startLoading, stopLoading } from "../../../lib/store/loading_store";
import toast from "solid-toast";
import Coming from "../../../components/layout/coming";

export default function Analytics() {
  return (
    <>
      <MetaTitle title="Analytics" />

      <RouteProtection>
        <BuyerLimitation>
          <Container>
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <a className="link text-primary" href="/">
                    Home
                  </a>
                </li>
                <li>Analytics</li>
              </ul>
            </div>
            <div className="m-2">
              <Coming />
            </div>
            ;
          </Container>
        </BuyerLimitation>
      </RouteProtection>
    </>
  );
}
