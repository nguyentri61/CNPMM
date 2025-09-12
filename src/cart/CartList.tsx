import { useCart } from "./CartProvider";
import CartItemComp from "./CartItem";

export default function CartList() {
  const { items, updateItem, removeItem } = useCart();
  return (
    <div>
      {items.length === 0 ? (
        <div>Giỏ hàng trống</div>
      ) : (
        items.map((it) => (
          <CartItemComp
            key={it.id}
            item={it}
            onUpdate={(q) => updateItem(it.id, q)}
            onRemove={() => removeItem(it.id)}
          />
        ))
      )}
    </div>
  );
}
