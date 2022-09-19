import { createContext, ReactNode } from 'react';
import { LocalCart } from '../types/cart';
import { useLocalStorage } from './useLocalStorage';

export const CartContext = createContext<LocalCart | undefined>(undefined);
export const CartDispatchContext = createContext<any>(null); //TODO: change type

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<LocalCart>('cart');

  return (
    <CartContext.Provider value={cart}>
      <CartDispatchContext.Provider value={setCart}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}
