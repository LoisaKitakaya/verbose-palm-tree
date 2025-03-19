import { userInfo } from "../../lib/store/auth_store";
import Unauthorized from "../../routes/401";

export default function BuyerLimitation(props) {
  if (userInfo.is_artist === "No") {
    return <Unauthorized />;
  }

  return props.children;
}
