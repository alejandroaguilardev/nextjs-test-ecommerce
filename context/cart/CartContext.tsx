import { createContext } from 'react';
import { ICartProduct, shippingAddress } from '../../interfaces';


interface ContextProps {
    isLoaded: boolean,
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: shippingAddress


    addProductToCart: (product: ICartProduct) => void;
    updatedCartQuantity: (product: ICartProduct) => void;
    updateAddress: (shippingAddress: shippingAddress) => void;
    removeCartProduct: (product: ICartProduct) => void;
    createOrder: () => Promise<{ hasError: boolean, message: string }>
}
export const CartContext = createContext({} as ContextProps);