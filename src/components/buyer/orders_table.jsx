import { createEffect, createSignal, For } from "solid-js";

export default function OrdersTable(props) {
  const [data, setData] = createSignal();

  createEffect(() => {
    setData(props.data);

    // console.log(data());
  }, props.data);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Payment Status</th>
              <th>Shipping Status</th>
              <th>Total Price</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            <For each={data()}>
              {(item, index) => (
                <tr key={item.id}>
                  <th>{index() + 1}</th>
                  <td>
                    {() => {
                      switch (item.payment_status) {
                        case "paid":
                          return (
                            <div className="badge badge-success">Paid</div>
                          );
                        case "not_paid":
                          return (
                            <div className="badge badge-error">Not Paid</div>
                          );
                      }
                    }}
                  </td>
                  <td>
                    {() => {
                      switch (item.shipping_status) {
                        case "shipped":
                          return (
                            <div className="badge badge-success">Shipped</div>
                          );
                        case "pending":
                          return <div className="badge">Pending</div>;
                        case "processing":
                          return <div className="badge">Processing</div>;
                        case "delivered":
                          return <div className="badge">Delivered</div>;
                        case "canceled":
                          return <div className="badge">Canceled</div>;
                      }
                    }}
                  </td>
                  <td>$ {item.total_price.toLocaleString()}</td>
                  <td>
                    <ul>
                      <For each={item.items}>
                        {(item, index) => (
                          <li key={item.product_id}>
                            <strong>{index() + 1}.</strong>{" "}
                            <strong>Name:</strong> {item.name} -{" "}
                            <strong>Quantity:</strong> {item.quantity} -{" "}
                            <strong>Price:</strong> $
                            {item.price.toLocaleString()}
                          </li>
                        )}
                      </For>
                    </ul>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </>
  );
}
