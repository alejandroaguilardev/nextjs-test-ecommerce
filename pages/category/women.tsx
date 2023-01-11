import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";


const WomenPage = () => {
    const { products, isLoading } = useProducts(`/products?gender=women`);


    return (
        <ShopLayout title={`Categoría Mujeres`} pageDescription={`Encuentra los productos de Mujeres`}>
            <Typography variant='h1' component='h1'>Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>Productos Mujeres</Typography>
            {
                isLoading ?
                    <FullScreenLoading />
                    :
                    <ProductList products={products} />
            }

        </ShopLayout>
    )
}

export default WomenPage;