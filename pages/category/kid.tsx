import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";


const KidPage = () => {
    const { products, isLoading } = useProducts(`/products?gender=kid`);


    return (
        <ShopLayout title={`Categoría Niños`} pageDescription={`Encuentra los productos de Niños`}>
            <Typography variant='h1' component='h1'>Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>Productos Niños</Typography>
            {
                isLoading ?
                    <FullScreenLoading />
                    :
                    <ProductList products={products} />
            }

        </ShopLayout>
    )
}

export default KidPage;