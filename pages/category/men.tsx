import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const MenPage = () => {
    const { products, isLoading } = useProducts(`/products?gender=men`);

    return (
        <ShopLayout title={`Categoría Hombres`} pageDescription={`Encuentra los productos de Hombres`}>
            <Typography variant='h1' component='h1'>Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>Productos Hombres</Typography>
            {
                isLoading ?
                    <FullScreenLoading />
                    :
                    <ProductList products={products} />
            }

        </ShopLayout>
    )
}

export default MenPage;