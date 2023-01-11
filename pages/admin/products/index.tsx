import useSWR from 'swr';
import { AddOutlined, ConfirmationNumberOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { AdminLayout } from "../../../components/layouts";
import { IProduct } from '../../../interfaces/products';
import Link from 'next/link';


const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Foto',
        renderCell: ({ row }) => {

            return (
                <a href={`/product/${row.slug}`} target='_blank' rel="noreferrer" >
                    <CardMedia
                        component='img'
                        className='fadeIn'
                        image={`${row.img}`}
                        alt={row.title}
                    />
                </a>
            )
        }

    },
    {
        field: 'title',
        headerName: 'Titulo',
        width: 250,
        renderCell: ({ row }) => {
            return (
                <Link href={`/admin/products/${row.slug}`} >
                    {row.title}
                </Link>
            )
        }
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },


]

const ProductsPage = () => {
    const { data, error } = useSWR('/api/admin/products');

    if (!data && !error) return <></>;


    const rows = data.map((product: IProduct) => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));


    return (
        <AdminLayout
            title={`Productos ${data?.length}`}
            subTitle='Mantenimiento de Productos'
            icon={<ConfirmationNumberOutlined />}
        >
            <Box display={'flex'} justifyContent='end'>
                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href="/admin/products/new"
                >
                    Crear Productos
                </Button>

            </Box>
            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>

            </Grid>
        </AdminLayout>
    )
}

export default ProductsPage
