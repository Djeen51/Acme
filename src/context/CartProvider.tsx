import {  ReactElement, createContext, useMemo, useReducer } from "react"

export type CartItemType = {
    sku: string,
    name: string,
    price: number,
    quantity: number,
}

type CartStateType = {cart: CartItemType[]}

const initCartState: CartStateType = { cart: []}

const REDUCER_ACTION_TYPE = {
    ADD: "ADD",
    REMOVE: "REMOVE",
    QUANTITY: "QUANTITY",
    SUBMIT: "SUBMIT", 
}

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

export type ReducerAction = {
    type: string,
    payload?: CartItemType
}

const reducer = (state: CartStateType, action: ReducerAction): CartStateType => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.ADD: {
            if(!action.payload) { // it helps developpers to catch an error and fix it 
                throw new Error('action.payload missing a ADD action')
            }
            const {sku, name, price } = action.payload  // const sku = action.payload.sku

            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)

            const quantity: number = itemExists? itemExists.quantity + 1 : 1

            return {...state, cart: [...filteredCart, {sku, name, price, quantity}]}
        }

        case REDUCER_ACTION_TYPE.REMOVE: {
            if(!action.payload) {
                throw new Error('action.payload missing a REMOVE action')
            }

            const {sku} = action.payload

            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            return {...state, cart: [...filteredCart]}
        }

        case REDUCER_ACTION_TYPE.QUANTITY: {
            if(!action.payload) {
                throw new Error('action.payload missing a QUANTITY action')
            }

            const {sku, quantity } = action.payload


            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)
            if (!itemExists) {
                throw new Error('Item must exist in order to update quantity')
            }

            const updatedItem: CartItemType = {
                ...itemExists, quantity
            }

            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            return {...state, cart: [...filteredCart, updatedItem]}
        }

        case REDUCER_ACTION_TYPE.SUBMIT: {
            return {...state, cart: []}
        }
        default: 
        throw new Error("unidentified reducer action type")
    }
}

const useCartContext = (initCartState: CartStateType) => {
    const [state, dispatch]= useReducer(reducer, initCartState)

    const REDUCER_ACTION = useMemo(() => {
        return REDUCER_ACTION_TYPE
    }, [])

    const totalItems = state.cart.reduce((previousValue, cartItem) => {
        return previousValue + cartItem.quantity
    }, 0)

    const totalPrice = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(
        state.cart.reduce((previousValue, cartItem) => {
            return previousValue + (cartItem.quantity * cartItem.price)
        }, 0)
    )

    const cart = state.cart.sort((a,b) => {
        const itemA = Number(a.sku.slice(-4))
        const itemB = Number(b.sku.slice(-4))

        return itemA - itemB
    })

    return {dispatch, REDUCER_ACTION, totalItems, totalPrice, cart}
}

export type UseCartContextType = ReturnType<typeof useCartContext>

const initCartContextState: UseCartContextType = {
    dispatch: () => {},
    REDUCER_ACTION: REDUCER_ACTION_TYPE,
    totalItems: 0,
    totalPrice: '',
     cart: [],
}


export const CartContext = createContext<UseCartContextType>(initCartContextState)

type ChildrenType = {children?: ReactElement | ReactElement[]}

export const CartProvider = ({children}: ChildrenType): ReactElement => {
    return <CartContext.Provider value= {useCartContext(initCartState)}>
        {children}
    </CartContext.Provider>
}

export default CartContext



// export type CartType = {
//     sku: string,
//     name: string,
//     price: number,
//     quantity: number
// }

// export type CartStateType = {cart: CartType[]}

//  const initCartState: CartStateType = {cart: []}

// const REDUCER_ACTIONS_TYPE = {
//     ADD: "ADD",
//     REMOVE: "REMOVE",
//     QUANTITY: "QUANTITY",
//     SUBMIT: "SUBMIT"
// }

// export type ReducerActionsType = typeof REDUCER_ACTIONS_TYPE

// type ReducerAction = {
//     type: string,
//     payload?: CartType
// }

// const reducer = (state:CartStateType, action: ReducerAction): CartStateType => {
//     switch(action.type) {
//         case REDUCER_ACTIONS_TYPE.ADD : {
//             if(!action.payload) throw new Error("action payload required in ADD")
//             const {sku, name, price} = action.payload

//             const filteredCart: CartType[] = state.cart.filter(item => item.sku !== sku)

//             const itemExists: CartType | undefined = state.cart.find(item => item.sku === sku)

//             const quantity : number = itemExists? itemExists.quantity + 1 : 1

//             return {...state, cart: [...filteredCart, {sku, name, price, quantity}]
//         }
//     }
//         case REDUCER_ACTIONS_TYPE.REMOVE : {
//             if(!action.payload) throw new Error("payload required in action Remove")

//             const {sku} = action.payload

//             const filteredCart : CartType[] = state.cart.filter(item => item.sku !== sku) 

//             return {...state, cart: [...filteredCart]}
//         }

//         case REDUCER_ACTIONS_TYPE.QUANTITY : {
//             if(!action.payload) throw new Error("payload required in action Quantity")

//             const {sku, quantity} = action.payload

//             const itemExists: CartType | undefined = state.cart.find(item => item.sku === sku)

//             if (!itemExists) throw new Error("item must exists if you want to add quantity")

//             const filteredCart: CartType[] = state.cart.filter(item => item.sku !== sku)


//             const itemUpdated: CartType | undefined =  {...itemExists, quantity}

//             return {...state, cart: [...filteredCart, itemUpdated]}
//         }

//         case REDUCER_ACTIONS_TYPE.SUBMIT : {
//             return {...state, cart :[]}
//         }

//         default: {
//             throw new Error("no action selected")
//         }
//   }
// }

// const UseCartContext = (initCartState: CartStateType) => {
//     const [state, dispatch] = useReducer(reducer, initCartState)

//     const ACTION_TYPES = useMemo(()=>{
//         return REDUCER_ACTIONS_TYPE
//     }, [])

//     const totalItems = state.cart.reduce((previousValue, item) => {
//         return previousValue + item.quantity
//     }, 0)

//     const totalPrice = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(
//         state.cart.reduce((previousvalue, item) => {
//            return previousvalue + item.quantity * item.price  
//         },0)
//     )

//     const sortedCart = state.cart.sort((a,b) => {
//         const itemA = Number(a.sku.slice(-4))
//         const itemB = Number(b.sku.slice(-4))

//         return itemA - itemB
//     })

//     return {dispatch, ACTION_TYPES, totalItems, totalPrice, sortedCart}
// }

// export type UseCartContextType = ReturnType<typeof UseCartContext>

// const initUseCartContext: UseCartContextType = {
//     dispatch : () => {},
//     ACTION_TYPES: REDUCER_ACTIONS_TYPE,
//     totalItems: 0,
//     totalPrice: "",
//     sortedCart: []
// } 

// const CartContext = createContext<UseCartContextType>(initUseCartContext)

// type ChildrenType = {children?: ReactElement | ReactElement[]}

// export const CartContextProvider = ({children}: ChildrenType) :ReactElement => {
//     return <CartContext.Provider value={UseCartContext(initCartState)}>
//         {children}
//     </CartContext.Provider>
// }

// export default CartContext