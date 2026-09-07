import CartItem from './CartItem';

export default function CartList({ items, onRemove, onUpdateQuantity }) {
  return (
    <div>
      {items.map((item) => (
        <CartItem
          key={`${item.id}-${item.size}-${item.color}`}
          item={item}
          onRemove={onRemove}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}
