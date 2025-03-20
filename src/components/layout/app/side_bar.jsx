export default function SideBar() {
  return (
    <>
      <ul className="menu bg-base-300 text-base-content min-h-full w-52 p-4">
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
                <a href="/store/products/reviews">Reviews</a>
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
                <a href="/store/orders/shipments">Shipments</a>
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
            </ul>
          </details>
        </li>
      </ul>
    </>
  );
}
