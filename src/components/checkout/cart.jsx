import { checkoutStore } from "../../lib/store/checkout_store";
import { loadingState } from "../../lib/store/loading_store";

export default function Cart(props) {
  return (
    <>
      <section class="p-4">
        <div class="container mx-auto">
          <div class="max-w-3xl mx-auto">
            <div class="space-y-6">
              <ul class="space-y-4">
                {/* Cart Items */}
                <For each={checkoutStore.state.items}>
                  {(item) => (
                    <li class="card card-side bg-base-100 shadow-sm">
                      <figure class="w-32">
                        <img
                          src={item.product.image || "/placeholder-product.jpg"}
                          alt={item.product.name}
                          class="h-full object-cover"
                        />
                      </figure>
                      <div class="card-body">
                        <h2 class="card-title">{item.product.name}</h2>
                        <div class="text-sm text-base-content/80">
                          <p>
                            Store:{" "}
                            <a
                              href={`/store/${item.product.artist.slug}`}
                              className="link link-hover text-primary"
                            >
                              {item.product.artist.store_name}
                            </a>
                          </p>
                          {item.product.stock > 0 ? (
                            <div className="badge badge-xs badge-success">
                              In Stock
                            </div>
                          ) : (
                            <div className="badge badge-xs badge-error">
                              Out of Stock
                            </div>
                          )}
                        </div>

                        <div class="card-actions justify-start items-center">
                          <div class="join">
                            <button
                              class="btn btn-sm join-item"
                              onClick={() =>
                                checkoutStore.updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </button>
                            <input
                              type="number"
                              class="input input-sm input-bordered join-item w-16 text-center"
                              value={item.quantity}
                              readOnly={true}
                              min="1"
                              onChange={(e) =>
                                checkoutStore.updateQuantity(
                                  item.product.id,
                                  parseInt(e.target.value)
                                )
                              }
                            />
                            <button
                              class="btn btn-sm join-item"
                              onClick={() =>
                                checkoutStore.updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            class="btn btn-sm text-error"
                            onClick={() =>
                              checkoutStore.removeItem(item.product.id)
                            }
                          >
                            <i class="bi bi-trash text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                </For>
              </ul>

              {/* Order Summary */}
              <div class="card bg-base-200">
                <div class="card-body">
                  <div class="space-y-4">
                    <div class="flex justify-between">
                      <span>Taxes</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div class="divider"></div>
                    <div class="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${checkoutStore.totalPrice}</span>
                    </div>

                    <button
                      class="btn btn-primary w-full"
                      onClick={checkoutStore.createOrder}
                      disabled={
                        checkoutStore.state.items.length === 0 ||
                        loadingState.isLoading
                      }
                    >
                      <Switch>
                        <Match when={!loadingState.isLoading}>
                          <span>Proceed to Checkout</span>
                        </Match>
                        <Match when={loadingState.isLoading}>
                          <span className="loading loading-bars loading-sm"></span>
                        </Match>
                      </Switch>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
