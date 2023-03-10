import { NextPage, GetServerSideProps } from "next"
import { Box, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { ProductList } from "../../components/products"
import { IProduct } from "../../interfaces"
import { getAllProducts, getProductByTerm } from "../../database/dbProducts"


interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

    return (
        <ShopLayout title='Teslo-Shop - Home' pageDescription='Encuentra los mejores productos de Teslo aquí'>
            <Typography variant='h1' component='h1'>Buscar Productos</Typography>

            {
                foundProducts ?
                    <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'> Término: {query}</Typography>
                    :
                    <>
                        <Box display='flex'>

                            <Typography variant='h2' sx={{ mb: 1 }}>No encontramos ningún producto</Typography>
                            <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
                        </Box>
                    </>
            }

            <ProductList products={products} />
        </ShopLayout>
    )
}



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };
    if (query.length === 0) {
        return {
            redirect: {
                destination: "/",
                permanent: true,
            },
        };
    }

    let products = await getProductByTerm(query);
    const foundProducts = products.length > 0;

    if (!foundProducts) {
        products = await getAllProducts();
        // products = await getProductByTerm('short');

    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}


export default SearchPage