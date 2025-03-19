import { Show } from "solid-js";
import { checkoutStore } from "../../lib/store/checkout_store";
import { favoritesStore } from "../../lib/store/favorite_store";
import { userInfo } from "../../lib/store/auth_store";

// Revised product card implementation
export default function ProductCard(props) {
  const { item } = props;

  const cartItem = () =>
    checkoutStore.state.items.find((i) => i.product.id === item.id);

  const handleAdd = () => checkoutStore.addItem(item);
  const handleRemove = () => checkoutStore.removeItem(item.id);

  return (
    <Show when={userInfo.is_artist === "No"}>
      <div className="flex gap-4 items-center p-3">
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm"
            onClick={handleRemove}
            disabled={!cartItem()}
          >
            &minus;
          </button>

          <input
            type="number"
            value={cartItem()?.quantity || 0}
            className="input input-sm w-36 focus:border-0"
            readOnly={true}
            onChange={(e) =>
              checkoutStore.updateQuantity(item.id, parseInt(e.target.value))
            }
          />

          <button
            className="btn btn-sm"
            onClick={handleAdd}
            disabled={item.stock <= 0}
          >
            &plus;
          </button>
        </div>

        <button
          className="btn btn-sm"
          disabled={item.stock <= 0}
          onClick={() => favoritesStore.toggleFavorite(item.id)}
        >
          <Switch>
            <Match when={favoritesStore.favorites.items.includes(item.id)}>
              <i class="bi bi-heart-fill"></i>
            </Match>
            <Match when={!favoritesStore.favorites.items.includes(item.id)}>
              <i class="bi bi-heart"></i>
            </Match>
          </Switch>
        </button>
      </div>
    </Show>
  );
}
