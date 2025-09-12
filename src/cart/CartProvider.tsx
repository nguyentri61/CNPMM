import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import type { CartItem } from "./types";
type State = { items: CartItem[] };

type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "UPDATE"; payload: { id: string; quantity: number } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CLEAR" };

const initialState: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const item = action.payload;
      const exist = state.items.find((i) => i.id === item.id);
      if (exist) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }
    case "UPDATE": {
      const { id, quantity } = action.payload;
      return {
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }
    case "REMOVE": {
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<any>(null);

export function CartProvider({
  children,
  initial = [] as CartItem[],
}: {
  children: ReactNode;
  initial?: CartItem[];
}) {
  const [state, dispatch] = useReducer(reducer, { items: initial });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state.items));
    } catch (e) {}
  }, [state.items]);

  const addItem = (item: CartItem) => dispatch({ type: "ADD", payload: item });
  const updateItem = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE", payload: { id, quantity } });
  const removeItem = (id: string) =>
    dispatch({ type: "REMOVE", payload: { id } });
  const clear = () => dispatch({ type: "CLEAR" });

  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        updateItem,
        removeItem,
        clear,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
