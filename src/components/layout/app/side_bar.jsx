export default function SideBar() {
  return (
    <>
      <ul className="menu bg-base-300 text-base-content min-h-full w-52 p-4 flex flex-col justify-between">
        <div>
          <li>
            <a href="/" className="">
              <i class="bi bi-house-fill">
                {" "}
                <span class="pl-1.5 font-normal">Home</span>
              </i>
            </a>
          </li>
          <li>
            <details open={false}>
              <summary>
                <a href="/store/products">
                  <i class="bi bi-tag-fill"></i> Products
                </a>
              </summary>
              <ul>
                <li>
                  <a href="/store/products/collections">Collections</a>
                </li>
                <li>
                  <a href="/store/products/inventory">Inventory</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open={false}>
              <summary>
                <a href="/store/orders">
                  <i class="bi bi-inbox-fill"></i> Orders
                </a>
              </summary>
              <ul>
                <li>
                  <a href="/store/orders/purchases">Purchases</a>
                </li>
                <li>
                  <a href="/store/orders/shipment">Shipment</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open={false}>
              <summary>
                <a href="/store/analytics">
                  <i class="bi bi-bar-chart-fill"></i> Analytics
                </a>
              </summary>
              <ul>
                <li>
                  <a href="/store/analytics/reports">Reports</a>
                </li>
                <li>
                  <a href="/store/analytics/live-view">Live View</a>
                </li>
              </ul>
            </details>
          </li>
        </div>
        <div>
          <li>
            <a href="/account">
              <i class="bi bi-person-fill"></i> Account
            </a>
          </li>
        </div>
      </ul>
    </>
  );
}
