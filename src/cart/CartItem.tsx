import React from "react";
import { CartItem as CI } from "./types";
import Button from "../components/Button";

export default function CartItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: CI;
  onUpdate: (q: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b py-2">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-600">{item.price} đ</div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={item.quantity}
          min={1}
          onChange={(e) => onUpdate(Number(e.target.value))}
          className="w-16 border rounded px-1"
        />
        <Button variant="danger" onClick={onRemove}>
          Xoá
        </Button>
      </div>
    </div>
  );
}
