import {create} from 'zustand'


export type CartProduct = {
    title: string,
    image: number,
    sku: string
}


export type Cart = {
    product: CartProduct,
    product_id: string,
    sku: string,
    variant_id: string
    quantity: number
}

export interface CartState {
    isOpenCart: boolean,
    carts: Cart[]
    fetchCarts: (payload: Cart[]) => void
    addToCart: (payload: Cart, isOpenCart: boolean) => void
    toggleOpenCart: (isOpenCart: boolean) => void
}

const useCartState = create<CartState>(set => ({
    isOpenCart: false,
    carts: [],
    fetchCarts: (payload) => set({
        carts: payload
    }),
    addToCart: (payload, isOpenCart = false) => set(function (state) {
        if (payload) {
            let updateIndex = state.carts.findIndex(c => {
                if (c.product_id === payload.product_id
                    && c.variant_id === payload.variant_id
                    && c.sku === payload.sku
                ) {
                    return true
                }
            })

            if (updateIndex === -1) {
                return {
                    carts: [...state.carts, payload],
                    isOpenCart: isOpenCart
                }
            } else {
                state.carts[updateIndex].quantity++
                return {
                    carts: state.carts,
                    isOpenCart: isOpenCart
                }
            }


        }
    }),
    toggleOpenCart: (isOpen = true) => set({
        isOpenCart: isOpen
    })
}))

export default useCartState