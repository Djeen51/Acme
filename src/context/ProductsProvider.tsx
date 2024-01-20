import  { ReactElement, createContext, useState } from "react"

    
const initState: ProductType[] = [ 
    {
        "sku": "item0001",
        "name": "Widget",
        "price": 9.99
    },
    {
        "sku": "item0002",
        "name": "Premium Widget",
        "price": 19.99
    },
    {
        "sku": "item0003",
        "name": "Deluxe Widget",
        "price": 29.99
    }
]

export type ProductType = {
    sku: string,
    name: string,
    price: number
}





    export type UseProductsContextType = {products: ProductType[] }

    const initContextState: UseProductsContextType = { products: []}

    const ProductsContext = createContext<UseProductsContextType>(initContextState)

    type ChildrenType = {children?: ReactElement | ReactElement[]}

    export const ProductsProvider = ({children}: ChildrenType): ReactElement => {
        const [products, setProducts] = useState<ProductType[]>(initState)

        // useEffect(() => {
        //     const fetchProducts = async(): Promise<ProductType[]> => {
        //         const data = await fetch('http://localhost:3500/products').then(res => {
        //             return res.json()
        //         }).catch(err => {
        //             if(err instanceof Error) console.log(err.message)
        //         } )
        //     return data
        //     }

        //     fetchProducts().then(products => setProducts(products))
        // }, [])

        return (
            <ProductsContext.Provider value= {{products}}>
                {children}
            </ProductsContext.Provider>
        )
    } 


    export default ProductsContext



// export type ProductType = {
//     sku: string, 
//     name: string, 
//     price: number
// }


// // const initState: ProductType[] = []

// export type ProductContextType = {products: ProductType[]}

// const initProductContext: ProductContextType = {products: []}

// type ChildrenType = { children?: ReactElement | ReactElement[]}

// const ProductContext = createContext<ProductContextType>(initProductContext)

// export const UseProductsContext = ({children}: ChildrenType) : ReactElement => {
//     const [products, setProducts] = useState<ProductType[]>(initState)

//     const fetchProducts = async() => {
//         try{
//             const res = await fetch('http://localhost:3500/products')
//             const data = await res.json()
//             setProducts(data)
//         }
//         catch (err){
//             if(err instanceof Error) throw new Error(err.name)
//         }
//     }

//     useEffect(() => {
//         fetchProducts()
//     }, [])

//    return  <ProductContext.Provider value={{products}}>
//     {children}
//    </ProductContext.Provider>
// }






