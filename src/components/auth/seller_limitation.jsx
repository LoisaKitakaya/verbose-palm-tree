import { userInfo } from "../../lib/store/auth_store";
import Unauthorized from "../../routes/401";

export default function SellerLimitation(props) {
  if (userInfo.is_artist === "Yes") {
    return <Unauthorized />;
  }

  return props.children;
}
