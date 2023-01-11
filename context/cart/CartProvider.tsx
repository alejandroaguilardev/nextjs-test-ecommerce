import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct, IOrder, shippingAddress } from '../../interfaces';
import { CartContext } from './CartContext';
import { cartReducer } from './cartReducer';
import { countries } from '../../utils';
import { tesloApi } from '../../api';
import axios from 'axios';

interface Props {
    children: ReactNode;
}



export interface ICartState {
    isLoaded: boolean,
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number,
    shippingAddress?: shippingAddress
}

const CART_INITIAL_STATE: ICartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined

};

export const CartProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer,
        CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const productInCard = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];

            dispatch({
                type: '[Cart] - LoadCart from cookies | storage',
                payload: productInCard
            })
        } catch (error) {
            dispatch({
                type: '[Cart] - LoadCart from cookies | storage',
                payload: []
            })
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            Cookie.set('cart', JSON.stringify(state.cart));
        }, 100);
    }, [state.cart]);

    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev: number, current: ICartProduct) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev: number, current: ICartProduct) => current.quantity * current.price + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0;

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })

    }, [state.cart]);

    useEffect(() => {
        if (Cookie.get('firstName')) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                address: Cookie.get('address') || '',
                address2: Cookie.get('address2') || '',
                zip: Cookie.get('zip') || '',
                city: Cookie.get('city') || '',
                country: Cookie.get('country') || countries[0].code,
                phone: Cookie.get('phone') || '',
            }

            dispatch({
                type: '[Cart] - LoadAddress from Cookies',
                payload: shippingAddress
            })
        }
    }, [])


    const addProductToCart = (product: ICartProduct) => {
        const productInCart = state.cart.some(p => p._id === product._id)
        if (!productInCart)
            return dispatch({
                type: '[Cart] - Update products in cart',
                payload: [...state.cart, product]
            })

        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);

        if (!productInCartButDifferentSize)
            return dispatch({
                type: '[Cart] - Update products in cart',
                payload: [...state.cart, product]
            })


        const updatedProducts = state.cart.map(p => {
            if (p._id !== product._id) return p;
            if (p.size !== product.size) return p;

            p.quantity += product.quantity;
            return p;
        })

        dispatch({
            type: '[Cart] - Update products in cart',
            payload: updatedProducts
        })
    }

    const updatedCartQuantity = (product: ICartProduct) => {
        dispatch({
            type: '[Cart] - Change cart quantity',
            payload: product
        })
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({
            type: '[Cart] - Remove products in cart',
            payload: product
        })
    }


    const updateAddress = (shippingAddress: shippingAddress) => {
        Cookie.set("firstName", shippingAddress.firstName)
        Cookie.set("lastName", shippingAddress.lastName)
        Cookie.set("address", shippingAddress.address)
        Cookie.set("address2", shippingAddress?.address2 || '')
        Cookie.set("zip", shippingAddress.zip)
        Cookie.set("city", shippingAddress.city)
        Cookie.set("country", shippingAddress.country)
        Cookie.set("phone", shippingAddress.phone)
        dispatch({
            type: '[Cart] - Update Address',
            payload: shippingAddress
        })
    }

    const createOrder = async (): Promise<{ hasError: boolean, message: string }> => {
        if (!state.shippingAddress) {
            throw new Error("No hay direccion de entrega");
        }

        const body: IOrder = {
            orderItems: state.cart.map(p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,
        }

        try {
            const { data } = await tesloApi.post('/orders', body);

            dispatch({ type: '[Cart] - Order Complete' })

            return {
                hasError: false,
                message: data._id
            }

        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message.toString()
                }
            }
            return {
                hasError: true,
                message: "Errono controlado, hable con el administrador"
            }
        }
    }


    return (
        <CartContext.Provider value={{
            ...state,
            addProductToCart,
            updatedCartQuantity,
            updateAddress,
            removeCartProduct,

            createOrder
        }}>
            {children}</CartContext.Provider>
    );
};