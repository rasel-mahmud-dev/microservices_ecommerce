import {create} from 'zustand'


export type CartProduct = {
    title: string,
    image: number,
    sku: string
}


export type CartItem = {
    cart_id?: string,
    product: CartProduct,
    product_id: string,
    sku: string,
    variant_id: string
    quantity: number
}

export type Cart = CartItem[]

export interface CartState {
    isOpenCart: boolean,
    carts: Cart
    selectedCartItem: string[]
    fetchCarts: (payload: Cart) => void
    addToCart: (payload: CartItem, isOpenCart: boolean) => void
    toggleOpenCart: (isOpenCart: boolean) => void,
    toggleSelectCartItem: (cartId: string) => void,

}

const useCartState = create<CartState>(set => ({
    isOpenCart: false,
    carts: [],
    selectedCartItem: [],
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

                state.carts[updateIndex] = payload

                return {
                    carts: state.carts,
                    isOpenCart: isOpenCart
                }
            }
        }
    }),
    toggleOpenCart: (isOpen = true) => set({
        isOpenCart: isOpen
    }),

    toggleSelectCartItem: (cartId: string) => set((state) => {
        let updateState = {...state}
        if (updateState.selectedCartItem.includes(cartId)) {
            updateState.selectedCartItem = updateState.selectedCartItem.filter(p => p !== cartId)
        } else {
            updateState.selectedCartItem = [...updateState.selectedCartItem, cartId]
        }
        return updateState
    })

}))

export default useCartState